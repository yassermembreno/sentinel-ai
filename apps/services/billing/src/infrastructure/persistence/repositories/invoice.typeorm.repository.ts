import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { Invoice } from '@billing/domain/billing.js';
import type { InvoiceRepository } from '@billing/application/ports/billing.repositories.js';
import { InvoiceEntity } from '@billing/infrastructure/persistence/entities/invoice.entity.js';

@Injectable()
export class InvoiceTypeOrmRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly repository: Repository<InvoiceEntity>,
  ) {}

  async findById(id: string): Promise<Invoice | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Invoice[]> {
    const entities = await this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(invoice: Invoice): Promise<Invoice> {
    const saved = await this.repository.save(
      this.repository.create({
        id: invoice.id,
        customerId: invoice.customerId,
        amount: String(invoice.amount),
        status: invoice.status,
        plan: invoice.plan,
      }),
    );
    return this.toDomain(saved);
  }

  private toDomain(entity: InvoiceEntity): Invoice {
    return {
      id: entity.id,
      customerId: entity.customerId,
      amount: Number(entity.amount),
      status: entity.status,
      plan: entity.plan,
    };
  }
}
