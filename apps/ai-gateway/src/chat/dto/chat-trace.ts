export const TracePolicy = {
  DENIED: 'DENIED',
  REQUIRE_APPROVAL: 'REQUIRE_APPROVAL',
} as const;

export type TracePolicy = (typeof TracePolicy)[keyof typeof TracePolicy];

export const TraceExecution = {
  EXECUTED: 'EXECUTED',
  ERROR: 'ERROR',
} as const;

export type TraceExecution =
  (typeof TraceExecution)[keyof typeof TraceExecution];

export const TraceIntegrity = {
  REWRITTEN: 'rewritten',
  VERIFIED: 'verified',
} as const;

export type TraceIntegrity =
  (typeof TraceIntegrity)[keyof typeof TraceIntegrity];

/**
 * Projection of what is already on execution messages.
 * Never invents ALLOW — successful execute is execution, not policy.
 */
export interface ChatTraceEntry {
  label: string;
  toolName?: string;
  policy?: TracePolicy;
  execution?: TraceExecution;
  integrity?: TraceIntegrity;
  toolOutput?: {
    structuredKeys: string[];
    untrustedText: boolean;
  };
}
