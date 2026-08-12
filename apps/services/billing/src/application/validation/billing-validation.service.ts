import { Injectable } from '@nestjs/common';
import {
  ValidationStrategy,
  createCreditSchema,
  createRefundSchema,
  changeBillingPlanSchema,
  uuidSchema,
  CreateCreditInput,
  CreateRefundInput,
  ChangeBillingPlanInput,
} from '@sentinel/validation';

import { ValidationDomainError } from '@billing/domain/errors/validation-error';

@Injectable()
export class BillingValidationService {
  constructor(private readonly strategy: ValidationStrategy) {}

  validateCreateCredit(input: unknown): CreateCreditInput {
    const result = this.strategy.validate(createCreditSchema, input);
    if (result.ok) {
      return result.value;
    }
    throw this.toValidationError(result.errors);
  }

  validateCreateRefund(input: unknown): CreateRefundInput {
    const result = this.strategy.validate(createRefundSchema, input);
    if (result.ok) {
      return result.value;
    }
    throw this.toValidationError(result.errors);
  }

  validateChangePlan(input: unknown): ChangeBillingPlanInput {
    const result = this.strategy.validate(changeBillingPlanSchema, input);
    if (result.ok) {
      return result.value;
    }
    throw this.toValidationError(result.errors);
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

  private toValidationError(
    errors: { path: string; message: string }[],
  ): ValidationDomainError {
    return new ValidationDomainError(
      errors.map((error) => error.message).join(', '),
      errors,
    );
  }
}
