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
export class GetTicketTool implements Tool {
  readonly name = 'get_ticket';
  readonly description = 'Get a single ticket by its UUID.';
  readonly capability: ToolCapability = ToolCapability.READ;
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      ticketId: {
        type: 'string',
        description: 'Ticket UUID',
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
      const { data } = await axios.get(
        `${this.options.baseUrl}/tickets/${ticketIdOrError}`,
        { timeout: 10_000 },
      );
      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { ticket: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(call, this.name, error, 'Get ticket failed');
    }
  }
}
