import {
  ValidationStrategy,
  createCustomerSchema,
  CreateCustomerInput,
} from '@sentinel/validation';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CustomerValidationService {
  constructor(private readonly strategy: ValidationStrategy) {}

  validateCreate(input: unknown): CreateCustomerInput {
    const result = this.strategy.validate(createCustomerSchema, input);

    if (result.ok) {
      return result.value;
    }

    throw new BadRequestException({
      message: 'Validation failed',
      errors: result.errors,
    });
  }
}
