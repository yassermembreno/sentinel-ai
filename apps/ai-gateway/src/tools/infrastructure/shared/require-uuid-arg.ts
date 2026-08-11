import { ToolCall } from '../../domain/value-objects/tool-call';
import {
  ToolErrorType,
  ToolResult,
} from '../../domain/value-objects/tool-result';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function requireUuidArg(
  call: ToolCall,
  toolName: string,
  value: unknown,
  field: string,
): string | ToolResult {
  if (isUuid(value)) {
    return value;
  }

  return {
    toolCallId: call.id,
    toolName,
    success: false,
    error: {
      type: ToolErrorType.EXECUTION_ERROR,
      message: `${field} must be a valid UUID (got: ${String(JSON.stringify(value ?? ''))})`,
    },
  };
}

export function isToolResult(value: string | ToolResult): value is ToolResult {
  return typeof value !== 'string';
}
