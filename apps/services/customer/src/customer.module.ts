import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CustomerEntity } from '@customer/infrastructure/persistence/entities/customer.entity.js';
import { CustomerTypeOrmRepository } from '@customer/infrastructure/persistence/repositories/customer.typeorm.repository.js';
import { CustomerService } from '@customer/application/services/customer.service.js';
import { CustomerController } from '@customer/controllers/customer.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomerController],
  providers: [
    {
      provide: 'CustomerRepository',
      useClass: CustomerTypeOrmRepository,
    },
    CustomerService,
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
