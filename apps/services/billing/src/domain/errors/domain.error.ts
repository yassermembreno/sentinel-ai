export type ErrorDetails = {
  path: string;
  message: string;
};

export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;
  constructor(
    message: string,
    public readonly errors: ErrorDetails[] = [],
  ) {
    super(message);
    this.name = new.target.name;
  }
}
