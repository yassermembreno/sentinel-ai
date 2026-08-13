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
export class GetInvoiceStatusTool implements Tool {
  readonly name = 'get_invoice_status';
  readonly description =
    'Get invoice status for a customer. Provide customerId (UUID) and optionally invoiceId (UUID).';
  readonly capability: ToolCapability = ToolCapability.READ;
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      customerId: { type: 'string', description: 'Customer UUID' },
      invoiceId: { type: 'string', description: 'Optional invoice UUID' },
    },
    required: ['customerId'],
  };

  constructor(
    @Inject(BILLING_SERVICE_OPTIONS)
    private readonly options: ServiceBaseUrlOptions,
  ) {}

  async execute(call: ToolCall): Promise<ToolResult> {
    const invoiceId = call.arguments['invoiceId'];

    try {
      if (typeof invoiceId === 'string' && invoiceId.length > 0) {
        const idOrError = requireUuidArg(
          call,
          this.name,
          invoiceId,
          'invoiceId',
        );
        if (isToolResult(idOrError)) {
          return idOrError;
        }

        const { data } = await axios.get(
          `${this.options.baseUrl}/invoices/${idOrError}`,
          { timeout: 10_000 },
        );
        return {
          toolCallId: call.id,
          toolName: this.name,
          success: true,
          data: { invoice: data },
        };
      }

      const customerIdOrError = requireUuidArg(
        call,
        this.name,
        call.arguments['customerId'],
        'customerId',
      );
      if (isToolResult(customerIdOrError)) {
        return customerIdOrError;
      }

      const { data } = await axios.get(`${this.options.baseUrl}/invoices`, {
        params: { customerId: customerIdOrError },
        timeout: 10_000,
      });

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { invoices: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(
        call,
        this.name,
        error,
        'Get invoice status failed',
      );
    }
  }
}
