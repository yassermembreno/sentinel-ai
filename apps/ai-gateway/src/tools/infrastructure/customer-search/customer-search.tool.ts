import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { Tool } from '../../application/ports/tool';
import { ToolCapability } from '../../domain/enums/tool-capability';
import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';
import { CustomerServiceOptions } from '../customer-search/customer-service.options';
import { CUSTOMER_SERVICE_OPTIONS } from '../customer-search/customer-service.options.token';
import { executionErrorResult } from '../shared/execution-error-result';

@Injectable()
export class CustomerSearchTool implements Tool {
  readonly name = 'customer_search';
  readonly description =
    'Search customers by name. Returns matching customer profiles.';
  readonly capability: ToolCapability = 'read';
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Optional customer name filter',
      },
    },
  };

  constructor(
    @Inject(CUSTOMER_SERVICE_OPTIONS)
    private readonly options: CustomerServiceOptions,
  ) {}

  async execute(call: ToolCall): Promise<ToolResult> {
    try {
      const { data } = await axios.get<unknown[]>(
        `${this.options.baseUrl}/customers`,
        { timeout: 10_000 },
      );

      const nameFilter = call.arguments['name'];
      const customers =
        typeof nameFilter === 'string' && nameFilter.trim().length > 0
          ? data.filter((item) => matchesName(item, nameFilter))
          : data;

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { customers },
      };
    } catch (error: unknown) {
      return executionErrorResult(
        call,
        this.name,
        error,
        'Customer search failed',
      );
    }
  }
}

function matchesName(item: unknown, nameFilter: string): boolean {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const name = (item as Record<string, unknown>)['name'];
  return (
    typeof name === 'string' &&
    name.toLowerCase().includes(nameFilter.toLowerCase())
  );
}
