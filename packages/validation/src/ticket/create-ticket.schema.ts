import { z } from 'zod';

export const createTicketSchema = z.object({
  customerId: z.string().uuid(),
  subject: z.string().trim().min(1).max(255),
  description: z.string().trim().max(10_000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
