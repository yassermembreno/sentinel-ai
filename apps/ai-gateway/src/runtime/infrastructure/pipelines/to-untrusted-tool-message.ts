import { Message } from '../../domain/value-objects/message';
import { MessageRole } from '../../domain/enums/message-role';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import { ToolResult } from '../../../tools/domain/value-objects/tool-result';

/**
 * Projects tool-data provenance into the model context.
 * Marks results as untrusted tool data; does not authorize or deny execution.
 */
export function toUntrustedToolMessage(
  call: ToolCall,
  result: ToolResult,
): Message {
  return {
    role: MessageRole.TOOL,
    content: JSON.stringify({
      success: result.success,
      trust: 'untrusted',
      channel: 'tool_data',
      toolName: result.toolName,
      data: result.data,
      error: result.error,
    }),
    metadata: {
      toolName: result.toolName,
      toolCallId: result.toolCallId ?? call.id,
      arguments: call.arguments,
    },
  };
}
