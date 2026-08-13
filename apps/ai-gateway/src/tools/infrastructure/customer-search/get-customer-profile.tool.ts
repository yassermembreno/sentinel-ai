import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { Tool } from '../../application/ports/tool';
import { ToolCapability } from '../../domain/enums/tool-capability';
import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';
import { CustomerServiceOptions } from '../customer-search/customer-service.options';
import { CUSTOMER_SERVICE_OPTIONS } from '../customer-search/customer-service.options.token';
import { executionErrorResult } from '../shared/execution-error-result';
import {
  isToolResult,
  requireUuidArg,
} from '../shared/require-uuid-arg';

@Injectable()
export class GetCustomerProfileTool implements Tool {
  readonly name = 'get_customer_profile';
  readonly description = 'Get a customer profile by customer id (UUID).';
  readonly capability: ToolCapability = ToolCapability.READ;
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
    @Inject(CUSTOMER_SERVICE_OPTIONS)
    private readonly options: CustomerServiceOptions,
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
      const { data } = await axios.get(
        `${this.options.baseUrl}/customers/${customerIdOrError}`,
        { timeout: 10_000 },
      );

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { customer: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(
        call,
        this.name,
        error,
        'Get customer profile failed',
      );
    }
  }
}
