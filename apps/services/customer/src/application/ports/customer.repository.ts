import type { Customer } from '@customer/domain/customer.js';

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;

  save(customer: Customer): Promise<Customer>;
}
