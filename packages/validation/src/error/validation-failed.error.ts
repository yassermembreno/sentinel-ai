export class ValidationFailedError extends Error {
  constructor(public readonly errors: ValidationIssue[]) {
    super('Validation failed');
  }
}

export type ValidationIssue = {
  path: string;
  message: string;
};
