import { MutatingToolName } from './mutating-tool-name';

/**
 * Demo-scoped mutation claim classes for Layer C.
 * Heuristic / residual-language risk — not a cryptographic boundary.
 */
export enum ActionClaimClass {
  CREDIT_APPLIED = 'CREDIT_APPLIED',
  REFUND_ISSUED = 'REFUND_ISSUED',
  TICKET_CLOSED = 'TICKET_CLOSED',
  BILLING_PLAN_CHANGED = 'BILLING_PLAN_CHANGED',
}

/** Tool names that can substantiate each claim class via EXECUTED evidence. */
export const ACTION_CLAIM_TOOLS: Record<ActionClaimClass, readonly string[]> = {
  [ActionClaimClass.CREDIT_APPLIED]: [MutatingToolName.APPLY_CREDIT],
  [ActionClaimClass.REFUND_ISSUED]: [MutatingToolName.ISSUE_REFUND],
  [ActionClaimClass.TICKET_CLOSED]: [MutatingToolName.CLOSE_TICKET],
  [ActionClaimClass.BILLING_PLAN_CHANGED]: [
    MutatingToolName.CHANGE_BILLING_PLAN,
  ],
};
