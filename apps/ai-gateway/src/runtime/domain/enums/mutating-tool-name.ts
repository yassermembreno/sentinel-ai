/**
 * Temporary vocabulary consolidation for mutating tools.
 * Not a replacement for capability metadata — mutating-ness should
 * eventually come from ToolCapability, not a name registry.
 */
export const MutatingToolName = {
  APPLY_CREDIT: 'apply_credit',
  ISSUE_REFUND: 'issue_refund',
  CLOSE_TICKET: 'close_ticket',
  CREATE_TICKET: 'create_ticket',
  CHANGE_BILLING_PLAN: 'change_billing_plan',
} as const;

export type MutatingToolName =
  (typeof MutatingToolName)[keyof typeof MutatingToolName];
