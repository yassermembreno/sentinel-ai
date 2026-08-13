import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { Tool } from '../../application/ports/tool';
import { ToolCapability } from '../../domain/enums/tool-capability';
import { ToolCall } from '../../domain/value-objects/tool-call';
import {
  ToolErrorType,
  ToolResult,
} from '../../domain/value-objects/tool-result';
import { ServiceBaseUrlOptions } from '../shared/service-base-url.options';
import { BILLING_SERVICE_OPTIONS } from './billing-service.options.token';
import { executionErrorResult } from '../shared/execution-error-result';
import {
  isToolResult,
  isUuid,
  requireUuidArg,
} from '../shared/require-uuid-arg';

@Injectable()
export class IssueRefundTool implements Tool {
  readonly name = 'issue_refund';
  readonly description =
    'Issue a refund to a customer. Requires customerId (UUID) and amount. Optional invoiceId must be a UUID when provided.';
  readonly capability: ToolCapability = ToolCapability.FINANCIAL;
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      customerId: { type: 'string', description: 'Customer UUID' },
      amount: { type: 'number', description: 'Refund amount in USD' },
      invoiceId: { type: 'string', description: 'Optional invoice UUID' },
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

    const invoiceIdArg = call.arguments['invoiceId'];
    let invoiceId: string | undefined;
    if (typeof invoiceIdArg === 'string' && invoiceIdArg.length > 0) {
      if (!isUuid(invoiceIdArg)) {
        return {
          toolCallId: call.id,
          toolName: this.name,
          success: false,
          error: {
            type: ToolErrorType.EXECUTION_ERROR,
            message: `invoiceId must be a valid UUID (got: ${invoiceIdArg})`,
          },
        };
      }
      invoiceId = invoiceIdArg;
    }

    try {
      const { data } = await axios.post(
        `${this.options.baseUrl}/refunds`,
        {
          customerId: customerIdOrError,
          amount: call.arguments['amount'],
          ...(invoiceId ? { invoiceId } : {}),
        },
        { timeout: 10_000 },
      );

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { refund: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(call, this.name, error, 'Issue refund failed');
    }
  }
}
