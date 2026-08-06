import { Execution } from '../../domain/entities/execution';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';

export type PendingToolAction = {
  tool: string;
  arguments: Record<string, unknown>;
};

export type ToolExecutionDecision =
  | { status: 'ALLOW' }
  | { status: 'DENY'; reason: string }
  | {
      status: 'REQUIRE_APPROVAL';
      reason: string;
      pendingAction: PendingToolAction;
    };

export interface ToolExecutionPolicy {
  canExecute(
    toolCall: ToolCall,
    execution: Execution,
  ): ToolExecutionDecision;
}
