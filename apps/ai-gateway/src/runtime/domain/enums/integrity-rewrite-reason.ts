export const IntegrityRewriteReason = {
  UNSUBSTANTIATED_ACTION_CLAIM: 'UNSUBSTANTIATED_ACTION_CLAIM',
} as const;

export type IntegrityRewriteReason =
  (typeof IntegrityRewriteReason)[keyof typeof IntegrityRewriteReason];
