import { Message } from '../../domain/value-objects/message';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import { ToolResult } from '../../../tools/domain/value-objects/tool-result';

/**
 * Layer A: projects tool results into LLM context so free-text cannot present
 * as instruction authority. Does not authorize execution (Layer B) or rewrite
 * final claims (Layer C).
 */
export interface ToolOutputGuard {
  project(call: ToolCall, result: ToolResult): Message;
}
