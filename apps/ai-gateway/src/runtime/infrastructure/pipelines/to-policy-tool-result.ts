import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import {
  ToolErrorType,
  ToolResult,
} from '../../../tools/domain/value-objects/tool-result';
import {
  isAllow,
  ToolExecutionDecision,
} from '../../application/ports/tool-execution-policy';
import { ToolPolicyStatus } from '../../domain/enums/tool-policy-status';

export function toPolicyToolResult(
  call: ToolCall,
  decision: ToolExecutionDecision,
): ToolResult {
  if (isAllow(decision)) {
    throw new Error('ALLOW decisions must not be mapped to a policy tool result');
  }

  if (decision.status === ToolPolicyStatus.DENY) {
    return {
      toolCallId: call.id,
      toolName: call.toolName,
      success: false,
      data: {
        status: 'DENIED',
        code: decision.code,
      },
      error: {
        type: ToolErrorType.POLICY_DENIED,
        message: decision.reason,
      },
    };
  }

  return {
    toolCallId: call.id,
    toolName: call.toolName,
    success: false,
    data: {
      status: 'REQUIRE_APPROVAL',
      code: decision.code,
      pendingAction: decision.pendingAction,
    },
    error: {
      type: ToolErrorType.APPROVAL_REQUIRED,
      message: decision.reason,
    },
  };
}
