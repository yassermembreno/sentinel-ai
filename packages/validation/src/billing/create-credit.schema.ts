import { z } from 'zod';

export const createCreditSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  reason: z.string().trim().min(1).max(500).optional(),
});

export type CreateCreditInput = z.infer<typeof createCreditSchema>;
