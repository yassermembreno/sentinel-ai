import { Controller, Get, Param, Query } from '@nestjs/common';

import { InvoiceService } from '@billing/application/services/invoice.service';
import type { InvoiceResponseDto } from '@billing/application/dto/billing-response.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async list(
    @Query('customerId') customerId: string,
  ): Promise<InvoiceResponseDto[]> {
    return this.invoiceService.listByCustomer(customerId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.getById(id);
  }
}
