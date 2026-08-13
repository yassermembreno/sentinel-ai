/**
 * Layer B policy decision discriminant.
 * Not an evidence outcome — ALLOW means the policy permitted an attempt.
 */
export const ToolPolicyStatus = {
  ALLOW: 'ALLOW',
  DENY: 'DENY',
  REQUIRE_APPROVAL: 'REQUIRE_APPROVAL',
} as const;

export type ToolPolicyStatus =
  (typeof ToolPolicyStatus)[keyof typeof ToolPolicyStatus];
