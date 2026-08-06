import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import { ToolResult } from '../../../tools/domain/value-objects/tool-result';
import { ToolExecutionDecision } from '../../application/ports/tool-execution-policy';

export function toPolicyToolResult(
  call: ToolCall,
  decision: Exclude<ToolExecutionDecision, { status: 'ALLOW' }>,
): ToolResult {
  if (decision.status === 'DENY') {
    return {
      toolCallId: call.id,
      toolName: call.toolName,
      success: false,
      error: {
        type: 'POLICY_DENIED',
        message: decision.reason,
      },
    };
  }

  return {
    toolCallId: call.id,
    toolName: call.toolName,
    success: false,
    data: {
      pendingAction: decision.pendingAction,
    },
    error: {
      type: 'APPROVAL_REQUIRED',
      message: decision.reason,
    },
  };
}
