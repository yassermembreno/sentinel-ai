import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CustomerService } from '@customer/application/services/customer.service.js';
import type { CustomerResponseDto } from '@customer/application/dto/customer-response.dto.js';
import { CustomerValidationService } from '@customer/application/validation/customer-validation-service';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerValidationService: CustomerValidationService,
  ) {}

  @Post()
  async create(@Body() body: unknown): Promise<CustomerResponseDto> {
    const request = this.customerValidationService.validateCreate(body);
    return await this.customerService.createCustomer(request);
  }

  @Get()
  async list(): Promise<CustomerResponseDto[]> {
    return await this.customerService.listCustomers();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<CustomerResponseDto> {
    return await this.customerService.getCustomerById(id);
  }
}
