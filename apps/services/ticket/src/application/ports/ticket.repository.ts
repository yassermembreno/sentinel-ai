import type { Ticket } from '@ticket/domain/ticket.js';

export interface TicketRepository {
  findById(id: string): Promise<Ticket | null>;
  findByCustomerId(customerId: string): Promise<Ticket[]>;
  save(ticket: Ticket): Promise<Ticket>;
}
