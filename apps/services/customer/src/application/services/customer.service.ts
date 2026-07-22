import { Inject, Injectable } from '@nestjs/common';

import { CustomerStatus, type Customer } from '@customer/domain/customer.js';
import type { CustomerRepository } from '@customer/application/ports/customer.repository.js';
import type { CreateCustomerDto } from '@customer/application/dto/create-customer.dto.js';
import type { CustomerResponseDto } from '@customer/application/dto/customer-response.dto.js';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
  ) {}

  async createCustomer(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer: Customer = {
      id: crypto.randomUUID(),

      name: dto.name,

      email: dto.email,

      tier: dto.tier,

      status: CustomerStatus.ACTIVE,
    };

    const saved = await this.customerRepository.save(customer);

    return this.toResponse(saved);
  }

  async getCustomerById(id: string): Promise<CustomerResponseDto | null> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      return null;
    }

    return this.toResponse(customer);
  }

  private toResponse(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,

      name: customer.name,

      email: customer.email,

      tier: customer.tier,

      status: customer.status,
    };
  }
}
