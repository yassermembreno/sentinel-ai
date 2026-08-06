import { Inject, Injectable } from '@nestjs/common';

import type { InvoiceRepository } from '@billing/application/ports/billing.repositories.js';
import type { InvoiceResponseDto } from '@billing/application/dto/billing-response.dto.js';
import { BillingError } from '@billing/domain/errors/billing.error';
import { BillingErrorCodes } from '@billing/domain/errors/billing.error-codes';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async getById(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new BillingError(
        'Invoice not found',
        BillingErrorCodes.INVOICE_NOT_FOUND.code,
        BillingErrorCodes.INVOICE_NOT_FOUND.httpStatus,
      );
    }
    return invoice;
  }

  async listByCustomer(customerId: string): Promise<InvoiceResponseDto[]> {
    return this.invoiceRepository.findByCustomerId(customerId);
  }
}
