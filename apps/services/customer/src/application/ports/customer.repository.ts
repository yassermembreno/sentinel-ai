import type { Customer } from '@customer/domain/customer.js';

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;

  findAll(): Promise<Customer[]>;

  save(customer: Customer): Promise<Customer>;
}
