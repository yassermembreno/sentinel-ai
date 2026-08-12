import { Execution } from '../../domain/entities/execution';
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
  | { status: 'ALLOW' }
  | { status: 'DENY'; code: ToolPolicyCode; reason: string }
  | {
      status: 'REQUIRE_APPROVAL';
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
