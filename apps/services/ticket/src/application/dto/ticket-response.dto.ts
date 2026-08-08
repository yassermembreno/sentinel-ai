import type { TicketPriority, TicketStatus } from '@ticket/domain/ticket.js';

export type TicketResponseDto = Readonly<{
  id: string;
  customerId: string;
  subject: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
}>;
