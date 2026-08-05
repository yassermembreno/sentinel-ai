export class ValidationFailedError extends Error {
  readonly code = 'VALIDATION_FAILED';
  readonly httpStatus = 400;

  constructor(
    message: string,
    public readonly errors: ValidationIssue[],
  ) {
    super(message);
    this.name = new.target.name;
    this.errors = errors;
  }
}

export type ValidationIssue = {
  path: string;
  message: string;
};
