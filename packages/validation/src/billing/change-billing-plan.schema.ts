import { z } from 'zod';

export const changeBillingPlanSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'ENTERPRISE']),
});

export type ChangeBillingPlanInput = z.infer<typeof changeBillingPlanSchema>;
