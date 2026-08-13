import { Injectable } from '@nestjs/common';

import { Tool } from '../../application/ports/tool';
import { ToolCapability } from '../../domain/enums/tool-capability';
import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';

@Injectable()
export class EchoTool implements Tool {
  readonly name = 'echo';
  readonly description =
    'Echoes back the provided message. Use when the user asks to echo or repeat text.';
  readonly capability: ToolCapability = ToolCapability.READ;
  readonly parameters: Record<string, unknown> = {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'The message to echo back',
      },
    },
    required: ['message'],
  };

  async execute(call: ToolCall): Promise<ToolResult> {
    const message = call.arguments['message'];
    return {
      toolCallId: call.id,
      toolName: this.name,
      success: true,
      data: { echoed: message },
    };
  }
}
