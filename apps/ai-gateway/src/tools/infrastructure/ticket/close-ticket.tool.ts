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
export class CloseTicketTool implements Tool {
  readonly name = 'close_ticket';
  readonly description =
    'Close a support ticket after the underlying customer issue has been resolved by its real UUID.\nThe ticketId must come from a previous tool result or a valid existing identifier.';
  readonly capability: ToolCapability = ToolCapability.OPERATIONAL;
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      ticketId: {
        type: 'string',
        description: 'Ticket UUID (e.g. 22222222-2222-4222-8222-222222222222)',
      },
    },
    required: ['ticketId'],
  };

  constructor(
    @Inject(TICKET_SERVICE_OPTIONS)
    private readonly options: ServiceBaseUrlOptions,
  ) {}

  async execute(call: ToolCall): Promise<ToolResult> {
    const ticketIdOrError = requireUuidArg(
      call,
      this.name,
      call.arguments['ticketId'],
      'ticketId',
    );
    if (isToolResult(ticketIdOrError)) {
      return ticketIdOrError;
    }

    try {
      const { data } = await axios.post(
        `${this.options.baseUrl}/tickets/${ticketIdOrError}/close`,
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
