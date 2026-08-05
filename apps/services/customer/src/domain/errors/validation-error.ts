import { DomainError, ErrorDetails } from './domain.error.js';

export class ValidationDomainError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly httpStatus = 400;

  constructor(message: string, errors: ErrorDetails[]) {
    super(message, errors);
  }
}
