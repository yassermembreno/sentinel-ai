import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';

export interface ToolExecutor {
  execute(toolCall: ToolCall): Promise<ToolResult>;
}
