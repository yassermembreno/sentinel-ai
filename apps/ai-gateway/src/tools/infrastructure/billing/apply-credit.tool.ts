import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { Tool } from '../../application/ports/tool';
import { ToolCapability } from '../../domain/enums/tool-capability';
import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';
import { ServiceBaseUrlOptions } from '../shared/service-base-url.options';
import { BILLING_SERVICE_OPTIONS } from './billing-service.options.token';
import { executionErrorResult } from '../shared/execution-error-result';
import {
  isToolResult,
  requireUuidArg,
} from '../shared/require-uuid-arg';

@Injectable()
export class ApplyCreditTool implements Tool {
  readonly name = 'apply_credit';
  readonly description =
    'Apply a monetary credit to a customer account. Use this tool when a credit amount is requested or instructed for a customer. This action changes the customer billing state.';
  readonly capability: ToolCapability = 'financial';
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      customerId: { type: 'string', description: 'Customer UUID' },
      amount: { type: 'number', description: 'Credit amount in USD' },
      reason: { type: 'string', description: 'Optional reason' },
    },
    required: ['customerId', 'amount'],
  };

  constructor(
    @Inject(BILLING_SERVICE_OPTIONS)
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
      const { data } = await axios.post(
        `${this.options.baseUrl}/credits`,
        {
          customerId: customerIdOrError,
          amount: call.arguments['amount'],
          reason: call.arguments['reason'],
        },
        { timeout: 10_000 },
      );

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { credit: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(call, this.name, error, 'Apply credit failed');
    }
  }
}
