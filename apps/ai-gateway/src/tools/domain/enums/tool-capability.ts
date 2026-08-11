export const ToolCapability = {
  READ: 'read',
  OPERATIONAL: 'operational',
  FINANCIAL: 'financial',
} as const;

export type ToolCapability =
  (typeof ToolCapability)[keyof typeof ToolCapability];
