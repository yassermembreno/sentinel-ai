import { Controller, Get, Param, Query } from '@nestjs/common';

import { InvoiceService } from '@billing/application/services/invoice.service';
import { BillingValidationService } from '@billing/application/validation/billing-validation.service';
import type { InvoiceResponseDto } from '@billing/application/dto/billing-response.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly validationService: BillingValidationService,
  ) {}

  @Get()
  async list(
    @Query('customerId') customerId: string,
  ): Promise<InvoiceResponseDto[]> {
    const id = this.validationService.validateUuid(customerId, 'customerId');
    return this.invoiceService.listByCustomer(id);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<InvoiceResponseDto> {
    const invoiceId = this.validationService.validateUuid(id, 'invoiceId');
    return this.invoiceService.getById(invoiceId);
  }
}
