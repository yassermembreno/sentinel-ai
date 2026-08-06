import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { Credit } from '@billing/domain/billing.js';
import type { CreditRepository } from '@billing/application/ports/billing.repositories.js';
import { CreditEntity } from '@billing/infrastructure/persistence/entities/credit.entity.js';

@Injectable()
export class CreditTypeOrmRepository implements CreditRepository {
  constructor(
    @InjectRepository(CreditEntity)
    private readonly repository: Repository<CreditEntity>,
  ) {}

  async save(credit: Credit): Promise<Credit> {
    const saved = await this.repository.save(
      this.repository.create({
        id: credit.id,
        customerId: credit.customerId,
        amount: String(credit.amount),
        reason: credit.reason,
      }),
    );

    return {
      id: saved.id,
      customerId: saved.customerId,
      amount: Number(saved.amount),
      reason: saved.reason,
      createdAt: saved.createdAt,
    };
  }
}
