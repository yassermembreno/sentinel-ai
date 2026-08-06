import { DomainError } from './domain.error';

export class BillingError extends DomainError {
  constructor(
    message: string,
    public readonly code: string,
    public readonly httpStatus: number,
  ) {
    super(message);
    this.name = 'BillingError';
  }
}
