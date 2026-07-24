import { DomainError } from './domain.error';

export class CustomerError extends DomainError {
  readonly code = 'CUSTOMER_ERROR';
  readonly httpStatus = 409;

  constructor(message: string) {
    super(message);
    this.name = 'CustomerError';
  }
}
