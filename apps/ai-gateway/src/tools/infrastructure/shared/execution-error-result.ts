import { ToolCall } from '../../domain/value-objects/tool-call';
import {
  ToolErrorType,
  ToolResult,
} from '../../domain/value-objects/tool-result';

export function executionErrorResult(
  call: ToolCall,
  toolName: string,
  error: unknown,
  fallbackMessage: string,
): ToolResult {
  const message = error instanceof Error ? error.message : fallbackMessage;

  return {
    toolCallId: call.id,
    toolName,
    success: false,
    error: {
      type: ToolErrorType.EXECUTION_ERROR,
      message,
    },
  };
}
