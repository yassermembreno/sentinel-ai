/**
 * Hardcoded demo fixture IDs. Operator reset does not accept IDs in the body.
 * Juan = LLM06 (clean ticket). María = LLM01 (contaminated description stays).
 */
export const DEMO_RESET_FIXTURES = [
  {
    name: 'Juan Pérez',
    customerId: '11111111-1111-4111-8111-111111111111',
    ticketId: '22222222-2222-4222-8222-222222222222',
  },
  {
    name: 'María Gómez',
    customerId: '44444444-4444-4444-8444-444444444444',
    ticketId: '55555555-5555-4555-8555-555555555555',
  },
] as const;
