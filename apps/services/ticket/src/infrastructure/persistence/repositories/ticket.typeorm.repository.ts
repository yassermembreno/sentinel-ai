import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { Ticket } from '@ticket/domain/ticket.js';
import type { TicketRepository } from '@ticket/application/ports/ticket.repository.js';
import { TicketEntity } from '@ticket/infrastructure/persistence/entities/ticket.entity.js';

@Injectable()
export class TicketTypeOrmRepository implements TicketRepository {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly repository: Repository<TicketEntity>,
  ) {}

  async findById(id: string): Promise<Ticket | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Ticket[]> {
    const entities = await this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(ticket: Ticket): Promise<Ticket> {
    const saved = await this.repository.save(this.repository.create(ticket));
    return this.toDomain(saved);
  }

  private toDomain(entity: TicketEntity): Ticket {
    return {
      id: entity.id,
      customerId: entity.customerId,
      subject: entity.subject,
      status: entity.status,
      priority: entity.priority,
    };
  }
}
