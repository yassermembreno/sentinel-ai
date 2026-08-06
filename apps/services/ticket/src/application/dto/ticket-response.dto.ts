import type { TicketPriority, TicketStatus } from '@ticket/domain/ticket.js';

export type TicketResponseDto = Readonly<{
  id: string;
  customerId: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
}>;
