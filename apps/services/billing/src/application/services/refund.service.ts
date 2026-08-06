import { Inject, Injectable } from '@nestjs/common';
import type { CreateRefundInput } from '@sentinel/validation';

import type { RefundRepository } from '@billing/application/ports/billing.repositories.js';
import type { RefundResponseDto } from '@billing/application/dto/billing-response.dto.js';
import { RefundStatus } from '@billing/domain/billing.js';

@Injectable()
export class RefundService {
  constructor(
    @Inject('RefundRepository')
    private readonly refundRepository: RefundRepository,
  ) {}

  async issueRefund(input: CreateRefundInput): Promise<RefundResponseDto> {
    const refund = await this.refundRepository.save({
      id: crypto.randomUUID(),
      customerId: input.customerId,
      invoiceId: input.invoiceId ?? null,
      amount: input.amount,
      status: RefundStatus.COMPLETED,
      createdAt: new Date(),
    });

    return {
      id: refund.id,
      customerId: refund.customerId,
      invoiceId: refund.invoiceId,
      amount: refund.amount,
      status: refund.status,
      createdAt: refund.createdAt.toISOString(),
    };
  }
}
