import { z } from 'zod';

export const createRefundSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  invoiceId: z.string().uuid().optional(),
});

export type CreateRefundInput = z.infer<typeof createRefundSchema>;
