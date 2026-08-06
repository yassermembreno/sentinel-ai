import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BillingPlan } from '@billing/domain/billing.js';

@Entity({ name: 'billing_accounts' })
export class BillingAccountEntity {
  @PrimaryColumn({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ type: 'enum', enum: BillingPlan })
  plan!: BillingPlan;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
