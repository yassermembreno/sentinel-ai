import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { Tool } from '../../application/ports/tool';
import { ToolCapability } from '../../domain/enums/tool-capability';
import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';
import { ServiceBaseUrlOptions } from '../shared/service-base-url.options';
import { TICKET_SERVICE_OPTIONS } from './ticket-service.options.token';
import { executionErrorResult } from '../shared/execution-error-result';

@Injectable()
export class GetTicketTool implements Tool {
  readonly name = 'get_ticket';
  readonly description =
    'Get ticket details by ticketId, or list tickets by customerId.';
  readonly capability: ToolCapability = 'read';
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      ticketId: { type: 'string', description: 'Ticket UUID' },
      customerId: { type: 'string', description: 'Customer UUID' },
    },
  };

  constructor(
    @Inject(TICKET_SERVICE_OPTIONS)
    private readonly options: ServiceBaseUrlOptions,
  ) {}

  async execute(call: ToolCall): Promise<ToolResult> {
    const ticketId = call.arguments['ticketId'];
    const customerId = call.arguments['customerId'];

    try {
      if (typeof ticketId === 'string' && ticketId.length > 0) {
        const { data } = await axios.get(
          `${this.options.baseUrl}/tickets/${ticketId}`,
          { timeout: 10_000 },
        );
        return {
          toolCallId: call.id,
          toolName: this.name,
          success: true,
          data: { ticket: data },
        };
      }

      const { data } = await axios.get(`${this.options.baseUrl}/tickets`, {
        params: { customerId },
        timeout: 10_000,
      });

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { tickets: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(call, this.name, error, 'Get ticket failed');
    }
  }
}
