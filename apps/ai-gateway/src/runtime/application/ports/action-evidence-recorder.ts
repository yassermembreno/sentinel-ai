import { ToolCapability } from '../../../tools/domain/enums/tool-capability';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import { ToolResult } from '../../../tools/domain/value-objects/tool-result';
import { ActionClaimClass } from '../../domain/enums/action-claim-class';
import { ActionEvidence } from '../../domain/value-objects/action-evidence';
import { ToolExecutionDecision } from './tool-execution-policy';

export type RecordActionEvidenceInput = {
  toolCall: ToolCall;
  capability: ToolCapability;
  decision: ToolExecutionDecision;
  result: ToolResult;
};

/**
 * Per-execution append-only ledger.
 * EXECUTED is derived only by the recorder (ALLOW + success + mutating).
 */
export interface ActionEvidenceRecorder {
  record(input: RecordActionEvidenceInput): ActionEvidence | undefined;
  list(): readonly ActionEvidence[];
  hasExecutedForClaim(claim: ActionClaimClass): boolean;
}

export interface ActionEvidenceRecorderFactory {
  create(): ActionEvidenceRecorder;
}
