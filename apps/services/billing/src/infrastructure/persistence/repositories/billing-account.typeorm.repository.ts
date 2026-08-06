import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { BillingAccount, BillingPlan } from '@billing/domain/billing.js';
import type { BillingAccountRepository } from '@billing/application/ports/billing.repositories.js';
import { BillingAccountEntity } from '@billing/infrastructure/persistence/entities/billing-account.entity.js';
import { BillingError } from '@billing/domain/errors/billing.error';
import { BillingErrorCodes } from '@billing/domain/errors/billing.error-codes';

@Injectable()
export class BillingAccountTypeOrmRepository implements BillingAccountRepository {
  constructor(
    @InjectRepository(BillingAccountEntity)
    private readonly repository: Repository<BillingAccountEntity>,
  ) {}

  async findByCustomerId(customerId: string): Promise<BillingAccount | null> {
    const entity = await this.repository.findOne({ where: { customerId } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(account: BillingAccount): Promise<BillingAccount> {
    const saved = await this.repository.save(
      this.repository.create({
        customerId: account.customerId,
        plan: account.plan,
      }),
    );
    return this.toDomain(saved);
  }

  async updatePlan(
    customerId: string,
    plan: BillingPlan,
  ): Promise<BillingAccount> {
    const existing = await this.findByCustomerId(customerId);
    if (!existing) {
      throw new BillingError(
        'Billing account not found',
        BillingErrorCodes.ACCOUNT_NOT_FOUND.code,
        BillingErrorCodes.ACCOUNT_NOT_FOUND.httpStatus,
      );
    }

    await this.repository.update({ customerId }, { plan });
    return { customerId, plan };
  }

  private toDomain(entity: BillingAccountEntity): BillingAccount {
    return {
      customerId: entity.customerId,
      plan: entity.plan,
    };
  }
}
