import {
  ValidationStrategy,
  createCustomerSchema,
  CreateCustomerInput,
} from '@sentinel/validation';
import { Injectable } from '@nestjs/common';
import { ValidationDomainError } from '@customer/domain/errors/validation-error';

@Injectable()
export class CustomerValidationService {
  constructor(private readonly strategy: ValidationStrategy) {}

  validateCreate(input: unknown): CreateCustomerInput {
    const result = this.strategy.validate(createCustomerSchema, input);

    if (result.ok) {
      return result.value;
    }

    throw new ValidationDomainError(
      result.errors.map((error) => error.message).join(', '),
      result.errors,
    );
  }
}
