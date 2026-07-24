import { z } from 'zod';
import { ValidationIssue } from '../error/validation-failed.error.js';

export abstract class ValidationStrategy {
  abstract validate<TSchema extends z.ZodType>(
    schema: TSchema,
    input: unknown,
  ): ValidationResult<z.infer<TSchema>>;
}
export type ValidationResult<T> =
  { ok: true; value: T } | { ok: false; errors: ValidationIssue[] };
