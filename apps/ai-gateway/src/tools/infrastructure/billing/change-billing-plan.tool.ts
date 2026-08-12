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
export class ChangeBillingPlanTool implements Tool {
  readonly name = 'change_billing_plan';
  readonly description =
    'Change a customer billing plan. Requires customerId (UUID) and plan (FREE|PRO|ENTERPRISE).';
  readonly capability: ToolCapability = 'operational';
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      customerId: { type: 'string', description: 'Customer UUID' },
      plan: {
        type: 'string',
        enum: ['FREE', 'PRO', 'ENTERPRISE'],
        description: 'Target billing plan',
      },
    },
    required: ['customerId', 'plan'],
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
      const { data } = await axios.patch(
        `${this.options.baseUrl}/customers/${customerIdOrError}/plan`,
        { plan: call.arguments['plan'] },
        { timeout: 10_000 },
      );

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { account: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(
        call,
        this.name,
        error,
        'Change billing plan failed',
      );
    }
  }
}
