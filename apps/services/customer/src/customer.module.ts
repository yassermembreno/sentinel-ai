import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CustomerEntity } from '@customer/infrastructure/persistence/entities/customer.entity.js';
import { CustomerTypeOrmRepository } from '@customer/infrastructure/persistence/repositories/customer.typeorm.repository.js';
import { CustomerService } from '@customer/application/services/customer.service.js';
import { CustomerController } from '@customer/controllers/customer.controller.js';
import { CustomerValidationService } from './application/validation/customer-validation-service';
import {
  ValidationStrategy,
  SafeValidationStrategy,
} from '@sentinel/validation';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomerController],
  providers: [
    {
      provide: 'CustomerRepository',
      useClass: CustomerTypeOrmRepository,
    },
    {
      provide: ValidationStrategy,
      useClass: SafeValidationStrategy,
    },
    CustomerService,
    CustomerValidationService,
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
