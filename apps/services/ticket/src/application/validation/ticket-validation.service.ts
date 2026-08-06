import { Injectable } from '@nestjs/common';
import {
  ValidationStrategy,
  createTicketSchema,
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

    throw new ValidationDomainError(
      result.errors.map((error) => error.message).join(', '),
      result.errors,
    );
  }
}
