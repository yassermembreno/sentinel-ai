import { DomainError } from './domain.error';

export class CustomerError extends DomainError {
  constructor(
    message: string,
    public readonly code: string,
    public readonly httpStatus: number,
  ) {
    super(message);
    this.name = 'CustomerError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}
