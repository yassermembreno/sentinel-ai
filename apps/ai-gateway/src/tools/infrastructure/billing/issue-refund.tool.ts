import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { Tool } from '../../application/ports/tool';
import { ToolCapability } from '../../domain/enums/tool-capability';
import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';
import { ServiceBaseUrlOptions } from '../shared/service-base-url.options';
import { BILLING_SERVICE_OPTIONS } from './billing-service.options.token';
import { executionErrorResult } from '../shared/execution-error-result';

@Injectable()
export class IssueRefundTool implements Tool {
  readonly name = 'issue_refund';
  readonly description =
    'Issue a refund to a customer. Requires customerId and amount.';
  readonly capability: ToolCapability = 'financial';
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
    try {
      const { data } = await axios.post(
        `${this.options.baseUrl}/refunds`,
        {
          customerId: call.arguments['customerId'],
          amount: call.arguments['amount'],
          invoiceId: call.arguments['invoiceId'],
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
