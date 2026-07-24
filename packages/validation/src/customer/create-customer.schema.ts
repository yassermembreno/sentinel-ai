import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters'),

  email: z.email(),

  tier: z.enum(['FREE', 'PRO', 'ENTERPRISE']),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
