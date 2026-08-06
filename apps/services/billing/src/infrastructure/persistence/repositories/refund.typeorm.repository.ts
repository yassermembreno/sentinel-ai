import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { Refund } from '@billing/domain/billing.js';
import type { RefundRepository } from '@billing/application/ports/billing.repositories.js';
import { RefundEntity } from '@billing/infrastructure/persistence/entities/refund.entity.js';

@Injectable()
export class RefundTypeOrmRepository implements RefundRepository {
  constructor(
    @InjectRepository(RefundEntity)
    private readonly repository: Repository<RefundEntity>,
  ) {}

  async save(refund: Refund): Promise<Refund> {
    const saved = await this.repository.save(
      this.repository.create({
        id: refund.id,
        customerId: refund.customerId,
        invoiceId: refund.invoiceId,
        amount: String(refund.amount),
        status: refund.status,
      }),
    );

    return {
      id: saved.id,
      customerId: saved.customerId,
      invoiceId: saved.invoiceId,
      amount: Number(saved.amount),
      status: saved.status,
      createdAt: saved.createdAt,
    };
  }
}
