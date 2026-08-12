import { Inject, Injectable } from '@nestjs/common';
import type { CreateTicketInput } from '@sentinel/validation';

import type { TicketRepository } from '@ticket/application/ports/ticket.repository.js';
import type { TicketResponseDto } from '@ticket/application/dto/ticket-response.dto.js';
import { TicketPriority, TicketStatus } from '@ticket/domain/ticket.js';
import { TicketError } from '@ticket/domain/errors/ticket.error';
import { TicketErrorCodes } from '@ticket/domain/errors/ticket.error-codes';

@Injectable()
export class TicketService {
  constructor(
    @Inject('TicketRepository')
    private readonly ticketRepository: TicketRepository,
  ) {}

  async create(input: CreateTicketInput): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.save({
      id: crypto.randomUUID(),
      customerId: input.customerId,
      subject: input.subject,
      description: input.description ?? null,
      status: TicketStatus.OPEN,
      priority:
        (input.priority as TicketPriority | undefined) ?? TicketPriority.MEDIUM,
    });
    return ticket;
  }

  async getById(id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new TicketError(
        'Ticket not found',
        TicketErrorCodes.NOT_FOUND.code,
        TicketErrorCodes.NOT_FOUND.httpStatus,
      );
    }
    return ticket;
  }

  async listByCustomer(customerId: string): Promise<TicketResponseDto[]> {
    return this.ticketRepository.findByCustomerId(customerId);
  }

  async close(id: string): Promise<TicketResponseDto> {
    const ticket = await this.getById(id);
    if (ticket.status === TicketStatus.CLOSED) {
      throw new TicketError(
        'Ticket already closed',
        TicketErrorCodes.ALREADY_CLOSED.code,
        TicketErrorCodes.ALREADY_CLOSED.httpStatus,
      );
    }

    return this.ticketRepository.save({
      ...ticket,
      status: TicketStatus.CLOSED,
    });
  }
}
