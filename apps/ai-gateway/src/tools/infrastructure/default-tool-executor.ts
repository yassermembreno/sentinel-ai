import { Inject, Injectable } from '@nestjs/common';

import { ToolCall } from '../domain/value-objects/tool-call';
import { ToolResult } from '../domain/value-objects/tool-result';
import { ToolExecutor } from '../application/ports/tool-executor';
import { ToolRegistry } from '../application/ports/tool-registry';
import { TOOLS_REGISTRY } from '../application/ports/tool-registry.token';

@Injectable()
export class DefaultToolExecutor implements ToolExecutor {
  constructor(
    @Inject(TOOLS_REGISTRY)
    private readonly registry: ToolRegistry,
  ) {}

  async execute(toolCall: ToolCall): Promise<ToolResult> {
    if (!this.registry.has(toolCall.toolName)) {
      return {
        toolCallId: toolCall.id,
        toolName: toolCall.toolName,
        success: false,
        data: {
          error: `Unknown tool '${toolCall.toolName}'`,
        },
      };
    }

    const tool = this.registry.get(toolCall.toolName);
    return tool.execute(toolCall);
  }
}
