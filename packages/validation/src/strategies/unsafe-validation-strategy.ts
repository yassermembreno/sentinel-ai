import { z } from 'zod';
import { ValidationResult, ValidationStrategy } from './validation-strategy.js';

export class UnsafeValidationStrategy extends ValidationStrategy {
  validate<TSchema extends z.ZodType>(
    _schema: TSchema,
    input: unknown,
  ): ValidationResult<z.infer<TSchema>> {
    const result = _schema.safeParse(input);
    if (result.success) {
      return { ok: true, value: result.data };
    }
    return {
      ok: false,
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }
}
