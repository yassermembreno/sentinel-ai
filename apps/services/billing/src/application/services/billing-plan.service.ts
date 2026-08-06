import { Inject, Injectable } from '@nestjs/common';
import type { ChangeBillingPlanInput } from '@sentinel/validation';

import type { BillingAccountRepository } from '@billing/application/ports/billing.repositories.js';
import type { BillingAccountResponseDto } from '@billing/application/dto/billing-response.dto.js';
import { BillingPlan } from '@billing/domain/billing.js';

@Injectable()
export class BillingPlanService {
  constructor(
    @Inject('BillingAccountRepository')
    private readonly accountRepository: BillingAccountRepository,
  ) {}

  async changePlan(
    customerId: string,
    input: ChangeBillingPlanInput,
  ): Promise<BillingAccountResponseDto> {
    return this.accountRepository.updatePlan(
      customerId,
      input.plan as BillingPlan,
    );
  }
}
