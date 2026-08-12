import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { Tool } from '../../application/ports/tool';
import { ToolCapability } from '../../domain/enums/tool-capability';
import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';
import { ServiceBaseUrlOptions } from '../shared/service-base-url.options';
import { TICKET_SERVICE_OPTIONS } from './ticket-service.options.token';
import { executionErrorResult } from '../shared/execution-error-result';
import {
  isToolResult,
  requireUuidArg,
} from '../shared/require-uuid-arg';

@Injectable()
export class ListCustomerTicketsTool implements Tool {
  readonly name = 'list_customer_tickets';
  readonly description =
    'List all tickets associated with a customer, including open and closed tickets.';
  readonly capability: ToolCapability = 'read';
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      customerId: {
        type: 'string',
        description: 'Customer UUID',
      },
    },
    required: ['customerId'],
  };

  constructor(
    @Inject(TICKET_SERVICE_OPTIONS)
    private readonly options: ServiceBaseUrlOptions,
  ) {}

  async execute(call: ToolCall): Promise<ToolResult> {
    const customerIdOrError = requireUuidArg(
      call,
      this.name,
      call.arguments['customerId'],
      'customerId',
    );
    if (isToolResult(customerIdOrError)) {
      return customerIdOrError;
    }

    try {
      const { data } = await axios.get(`${this.options.baseUrl}/tickets`, {
        params: { customerId: customerIdOrError },
        timeout: 10_000,
      });

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { tickets: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(
        call,
        this.name,
        error,
        'List customer tickets failed',
      );
    }
  }
}
