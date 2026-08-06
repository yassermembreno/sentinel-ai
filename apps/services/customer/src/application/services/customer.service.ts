import {
  CustomerStatus,
  CustomerTier,
  type Customer,
} from '@customer/domain/customer.js';
import type { CustomerRepository } from '@customer/application/ports/customer.repository.js';
import type { CreateCustomerInput } from '@sentinel/validation';
import type { CustomerResponseDto } from '@customer/application/dto/customer-response.dto.js';
import { Inject, Injectable } from '@nestjs/common';
import { CustomerErrorCodes } from '@customer/domain/errors/customer.error-codes';
import { CustomerError } from '@customer/domain/errors/customer.error';

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

  async getCustomerById(id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new CustomerError(
        'Customer not found',
        CustomerErrorCodes.NOT_FOUND.code,
        CustomerErrorCodes.NOT_FOUND.httpStatus,
      );
    }

    return this.toResponse(customer);
  }

  async listCustomers(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findAll();
    return customers.map((customer) => this.toResponse(customer));
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
