import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerStatus, CustomerTier } from '@customer/domain/customer.js';

@Entity({
  name: 'customers',
})
export class CustomerEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id!: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    length: 320,
  })
  email!: string;

  @Column({
    type: 'enum',
    enum: CustomerTier,
  })
  tier!: CustomerTier;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
  })
  status!: CustomerStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
