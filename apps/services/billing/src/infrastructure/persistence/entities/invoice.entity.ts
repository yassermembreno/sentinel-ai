import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

import { BillingPlan, InvoiceStatus } from '@billing/domain/billing.js';

@Entity({ name: 'invoices' })
export class InvoiceEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ name: 'amount', type: 'numeric', precision: 12, scale: 2 })
  amount!: string;

  @Column({ type: 'enum', enum: InvoiceStatus })
  status!: InvoiceStatus;

  @Column({ type: 'enum', enum: BillingPlan })
  plan!: BillingPlan;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
