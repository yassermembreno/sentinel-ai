import { Injectable } from '@nestjs/common';
import {
  ValidationStrategy,
  createTicketSchema,
  uuidSchema,
  CreateTicketInput,
} from '@sentinel/validation';

import { ValidationDomainError } from '@ticket/domain/errors/validation-error';

@Injectable()
export class TicketValidationService {
  constructor(private readonly strategy: ValidationStrategy) {}

  validateCreate(input: unknown): CreateTicketInput {
    const result = this.strategy.validate(createTicketSchema, input);
    if (result.ok) {
      return result.value;
    }

    throw this.toError(result.errors);
  }

  validateUuid(value: unknown, field: string): string {
    const result = this.strategy.validate(uuidSchema, value);
    if (result.ok) {
      return result.value;
    }

    throw new ValidationDomainError(`${field} must be a valid UUID`, [
      { path: field, message: `${field} must be a valid UUID` },
    ]);
  }

  private toError(
    errors: { path: string; message: string }[],
  ): ValidationDomainError {
    return new ValidationDomainError(
      errors.map((error) => error.message).join(', '),
      errors,
    );
  }
}
