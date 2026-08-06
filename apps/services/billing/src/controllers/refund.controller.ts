import { Body, Controller, Post } from '@nestjs/common';

import { RefundService } from '@billing/application/services/refund.service';
import { BillingValidationService } from '@billing/application/validation/billing-validation.service';
import type { RefundResponseDto } from '@billing/application/dto/billing-response.dto';

@Controller('refunds')
export class RefundController {
  constructor(
    private readonly refundService: RefundService,
    private readonly validationService: BillingValidationService,
  ) {}

  @Post()
  async create(@Body() body: unknown): Promise<RefundResponseDto> {
    const input = this.validationService.validateCreateRefund(body);
    return this.refundService.issueRefund(input);
  }
}
