import { ToolCapability } from '../../../tools/domain/enums/tool-capability';
import { ToolPolicyStatus } from '../enums/tool-policy-status';

export const ActionEvidenceOutcome = {
  EXECUTED: 'EXECUTED',
  FAILED: 'FAILED',
  DENIED: 'DENIED',
  APPROVAL_REQUIRED: 'APPROVAL_REQUIRED',
} as const;

export type ActionEvidenceOutcome =
  (typeof ActionEvidenceOutcome)[keyof typeof ActionEvidenceOutcome];

/**
 * decision = Layer B policy snapshot that governed the action (not the outcome).
 */
export interface ActionEvidence {
  toolCallId: string;
  toolName: string;
  capability: ToolCapability;
  decision: ToolPolicyStatus;
  outcome: ActionEvidenceOutcome;
  arguments?: Record<string, unknown>;
}

export function isMutatingCapability(capability: ToolCapability): boolean {
  return (
    capability === ToolCapability.FINANCIAL ||
    capability === ToolCapability.OPERATIONAL
  );
}

/**
 * Policy blocked execution — not merely "did not execute".
 * FAILED is an allowed attempt that errored; it is not blocked.
 */
export function isBlockedOutcome(outcome: ActionEvidenceOutcome): boolean {
  return (
    outcome === ActionEvidenceOutcome.DENIED ||
    outcome === ActionEvidenceOutcome.APPROVAL_REQUIRED
  );
}

export type DeriveOutcomeInput = {
  decision: ToolPolicyStatus;
  success: boolean;
  capability: ToolCapability;
};

/**
 * Single Layer B → Layer C mapping. Callers never set EXECUTED.
 */
export function deriveOutcome(
  input: DeriveOutcomeInput,
): ActionEvidenceOutcome | undefined {
  if (input.decision === ToolPolicyStatus.DENY) {
    return ActionEvidenceOutcome.DENIED;
  }

  if (input.decision === ToolPolicyStatus.REQUIRE_APPROVAL) {
    return ActionEvidenceOutcome.APPROVAL_REQUIRED;
  }

  if (!input.success) {
    return ActionEvidenceOutcome.FAILED;
  }

  if (!isMutatingCapability(input.capability)) {
    return undefined;
  }

  return ActionEvidenceOutcome.EXECUTED;
}
