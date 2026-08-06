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
export class CloseTicketTool implements Tool {
  readonly name = 'close_ticket';
  readonly description = 'Close an open support ticket by ticketId.';
  readonly capability: ToolCapability = 'operational';
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      ticketId: { type: 'string', description: 'Ticket UUID' },
    },
    required: ['ticketId'],
  };

  constructor(
    @Inject(TICKET_SERVICE_OPTIONS)
    private readonly options: ServiceBaseUrlOptions,
  ) {}

  async execute(call: ToolCall): Promise<ToolResult> {
    const ticketId = String(call.arguments['ticketId'] ?? '');

    try {
      const { data } = await axios.post(
        `${this.options.baseUrl}/tickets/${ticketId}/close`,
        {},
        { timeout: 10_000 },
      );

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { ticket: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(call, this.name, error, 'Close ticket failed');
    }
  }
}
