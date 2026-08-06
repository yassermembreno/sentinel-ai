import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ValidationStrategy, SafeValidationStrategy } from '@sentinel/validation';

import { InvoiceEntity } from '@billing/infrastructure/persistence/entities/invoice.entity';
import { CreditEntity } from '@billing/infrastructure/persistence/entities/credit.entity';
import { RefundEntity } from '@billing/infrastructure/persistence/entities/refund.entity';
import { BillingAccountEntity } from '@billing/infrastructure/persistence/entities/billing-account.entity';
import { InvoiceTypeOrmRepository } from '@billing/infrastructure/persistence/repositories/invoice.typeorm.repository';
import { CreditTypeOrmRepository } from '@billing/infrastructure/persistence/repositories/credit.typeorm.repository';
import { RefundTypeOrmRepository } from '@billing/infrastructure/persistence/repositories/refund.typeorm.repository';
import { BillingAccountTypeOrmRepository } from '@billing/infrastructure/persistence/repositories/billing-account.typeorm.repository';
import { InvoiceService } from '@billing/application/services/invoice.service';
import { CreditService } from '@billing/application/services/credit.service';
import { RefundService } from '@billing/application/services/refund.service';
import { BillingPlanService } from '@billing/application/services/billing-plan.service';
import { BillingValidationService } from '@billing/application/validation/billing-validation.service';
import { InvoiceController } from '@billing/controllers/invoice.controller';
import { CreditController } from '@billing/controllers/credit.controller';
import { RefundController } from '@billing/controllers/refund.controller';
import { BillingPlanController } from '@billing/controllers/billing-plan.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceEntity,
      CreditEntity,
      RefundEntity,
      BillingAccountEntity,
    ]),
  ],
  controllers: [
    InvoiceController,
    CreditController,
    RefundController,
    BillingPlanController,
  ],
  providers: [
    { provide: 'InvoiceRepository', useClass: InvoiceTypeOrmRepository },
    { provide: 'CreditRepository', useClass: CreditTypeOrmRepository },
    { provide: 'RefundRepository', useClass: RefundTypeOrmRepository },
    {
      provide: 'BillingAccountRepository',
      useClass: BillingAccountTypeOrmRepository,
    },
    { provide: ValidationStrategy, useClass: SafeValidationStrategy },
    InvoiceService,
    CreditService,
    RefundService,
    BillingPlanService,
    BillingValidationService,
  ],
})
export class BillingModule {}
