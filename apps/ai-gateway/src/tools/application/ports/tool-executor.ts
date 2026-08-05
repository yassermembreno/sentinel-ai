import { ToolCall } from "../../../tools/domain/value-objects/tool-call.js";
import { ToolResult } from "../../../tools/domain/value-objects/tool-result.js";

export interface ToolExecutor {
    execute(toolCall: ToolCall): Promise<ToolResult>;
}