import { Execution } from '../../domain/entities/execution';
import { ToolPolicyStatus } from '../../domain/enums/tool-policy-status';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';

export type PendingToolAction = {
  tool: string;
  arguments: Record<string, unknown>;
};

export type ToolPolicyCode =
  | 'OPERATIONAL_ACTION_NOT_ALLOWED'
  | 'AUTONOMOUS_LIMIT_EXCEEDED'
  | 'REFUND_REQUIRES_APPROVAL'
  | 'INVALID_CREDIT_AMOUNT'
  | 'UNKNOWN_TOOL';

export type ToolExecutionDecision =
  | { status: typeof ToolPolicyStatus.ALLOW }
  | {
      status: typeof ToolPolicyStatus.DENY;
      code: ToolPolicyCode;
      reason: string;
    }
  | {
      status: typeof ToolPolicyStatus.REQUIRE_APPROVAL;
      code: ToolPolicyCode;
      reason: string;
      pendingAction: PendingToolAction;
    };

export interface ToolExecutionPolicy {
  canExecute(
    toolCall: ToolCall,
    execution: Execution,
  ): ToolExecutionDecision;
}

export function allowDecision(): ToolExecutionDecision {
  return { status: ToolPolicyStatus.ALLOW };
}

export function denyDecision(
  code: ToolPolicyCode,
  reason: string,
): ToolExecutionDecision {
  return { status: ToolPolicyStatus.DENY, code, reason };
}

export function requireApprovalDecision(
  code: ToolPolicyCode,
  reason: string,
  pendingAction: PendingToolAction,
): ToolExecutionDecision {
  return {
    status: ToolPolicyStatus.REQUIRE_APPROVAL,
    code,
    reason,
    pendingAction,
  };
}

export function isAllow(
  decision: ToolExecutionDecision,
): decision is { status: typeof ToolPolicyStatus.ALLOW } {
  return decision.status === ToolPolicyStatus.ALLOW;
}
