import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerEntity } from '@customer/infrastructure/persistence/entities/customer.entity.js';
import type { Customer } from '@customer/domain/customer.js';
import type { CustomerRepository } from '@customer/application/ports/customer.repository.js';

@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      tier: entity.tier,
      status: entity.status,
    };
  }

  async save(customer: Customer): Promise<Customer> {
    const entity = this.repository.create(customer);

    const saved = await this.repository.save(entity);

    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      tier: saved.tier,
      status: saved.status,
    };
  }
}
