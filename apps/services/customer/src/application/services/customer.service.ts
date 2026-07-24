import {
  CustomerStatus,
  CustomerTier,
  type Customer,
} from '@customer/domain/customer.js';
import type { CustomerRepository } from '@customer/application/ports/customer.repository.js';
import type { CreateCustomerInput } from '@sentinel/validation';
import type { CustomerResponseDto } from '@customer/application/dto/customer-response.dto.js';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
  ) {}

  async createCustomer(
    input: CreateCustomerInput,
  ): Promise<CustomerResponseDto> {
    const customer: Customer = {
      id: crypto.randomUUID(),

      name: input.name,

      email: input.email,

      tier: input.tier as CustomerTier,

      status: CustomerStatus.ACTIVE,
    };

    return this.customerRepository.save(customer);
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
