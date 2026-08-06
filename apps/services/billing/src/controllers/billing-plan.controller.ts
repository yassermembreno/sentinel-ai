import { Body, Controller, Param, Patch } from '@nestjs/common';

import { BillingPlanService } from '@billing/application/services/billing-plan.service';
import { BillingValidationService } from '@billing/application/validation/billing-validation.service';
import type { BillingAccountResponseDto } from '@billing/application/dto/billing-response.dto';

@Controller('customers')
export class BillingPlanController {
  constructor(
    private readonly planService: BillingPlanService,
    private readonly validationService: BillingValidationService,
  ) {}

  @Patch(':customerId/plan')
  async changePlan(
    @Param('customerId') customerId: string,
    @Body() body: unknown,
  ): Promise<BillingAccountResponseDto> {
    const input = this.validationService.validateChangePlan(body);
    return this.planService.changePlan(customerId, input);
  }
}
