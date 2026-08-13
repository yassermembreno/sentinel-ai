import { Inject, Injectable } from '@nestjs/common';
import type { CreateCreditInput } from '@sentinel/validation';

import type { CreditRepository } from '@billing/application/ports/billing.repositories.js';
import type { CreditResponseDto } from '@billing/application/dto/billing-response.dto.js';

@Injectable()
export class CreditService {
  constructor(
    @Inject('CreditRepository')
    private readonly creditRepository: CreditRepository,
  ) {}

  async applyCredit(input: CreateCreditInput): Promise<CreditResponseDto> {
    const credit = await this.creditRepository.save({
      id: crypto.randomUUID(),
      customerId: input.customerId,
      amount: input.amount,
      reason: input.reason ?? null,
      createdAt: new Date(),
    });

    return {
      id: credit.id,
      customerId: credit.customerId,
      amount: credit.amount,
      reason: credit.reason,
      createdAt: credit.createdAt.toISOString(),
    };
  }

  async deleteByCustomerId(customerId: string): Promise<number> {
    return this.creditRepository.deleteByCustomerId(customerId);
  }
}
