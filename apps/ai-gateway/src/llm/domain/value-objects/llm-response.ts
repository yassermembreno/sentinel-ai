import { Message } from "../../../runtime/domain/value-objects/message";
import { ToolCall } from "../../../tools/domain/value-objects/tool-call";

export interface LLMResponse {
    messages: Message[];
    toolCalls: ToolCall[];
}