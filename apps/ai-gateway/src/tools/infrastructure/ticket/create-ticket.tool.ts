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
export class CreateTicketTool implements Tool {
  readonly name = 'create_ticket';
  readonly description =
    'Create a support ticket for a customer. Requires customerId and subject.';
  readonly capability: ToolCapability = 'operational';
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      customerId: { type: 'string', description: 'Customer UUID' },
      subject: { type: 'string', description: 'Ticket subject' },
      priority: {
        type: 'string',
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        description: 'Optional priority',
      },
    },
    required: ['customerId', 'subject'],
  };

  constructor(
    @Inject(TICKET_SERVICE_OPTIONS)
    private readonly options: ServiceBaseUrlOptions,
  ) {}

  async execute(call: ToolCall): Promise<ToolResult> {
    try {
      const { data } = await axios.post(
        `${this.options.baseUrl}/tickets`,
        {
          customerId: call.arguments['customerId'],
          subject: call.arguments['subject'],
          priority: call.arguments['priority'],
        },
        { timeout: 10_000 },
      );

      return {
        toolCallId: call.id,
        toolName: this.name,
        success: true,
        data: { ticket: data },
      };
    } catch (error: unknown) {
      return executionErrorResult(
        call,
        this.name,
        error,
        'Create ticket failed',
      );
    }
  }
}
