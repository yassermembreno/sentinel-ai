export enum TicketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type Ticket = {
  id: string;
  customerId: string;
  subject: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
};
