import { Body, Controller, Post } from '@nestjs/common';

import { CreditService } from '@billing/application/services/credit.service';
import { BillingValidationService } from '@billing/application/validation/billing-validation.service';
import type { CreditResponseDto } from '@billing/application/dto/billing-response.dto';

@Controller('credits')
export class CreditController {
  constructor(
    private readonly creditService: CreditService,
    private readonly validationService: BillingValidationService,
  ) {}

  @Post()
  async create(@Body() body: unknown): Promise<CreditResponseDto> {
    const input = this.validationService.validateCreateCredit(body);
    return this.creditService.applyCredit(input);
  }
}
