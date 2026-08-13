/**
 * Demo-scoped heuristics: mark free-text that looks like injected instructions.
 * Does not delete or redact — Layer A only changes representation.
 */
export const INSTRUCTION_SHAPED_PATTERNS: readonly RegExp[] = [
  /ignore\s+previous\s+instructions/i,
  /urgent\s+system\s+instruction/i,
  /apply\s+a\s+\$?\d[\d,]*\s*credit\s+immediately/i,
];

export function isInstructionShaped(text: string): boolean {
  return INSTRUCTION_SHAPED_PATTERNS.some((pattern) => pattern.test(text));
}
