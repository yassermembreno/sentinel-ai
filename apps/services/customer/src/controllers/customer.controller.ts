import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { CustomerService } from '@customer/application/services/customer.service.js';
import type { CreateCustomerDto } from '@customer/application/dto/create-customer.dto.js';
import type { CustomerResponseDto } from '@customer/application/dto/customer-response.dto.js';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return await this.customerService.createCustomer(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerService.getCustomerById(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
}
