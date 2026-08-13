import type {
  BillingAccount,
  BillingPlan,
  Credit,
  Invoice,
  Refund,
} from '@billing/domain/billing.js';

export interface InvoiceRepository {
  findById(id: string): Promise<Invoice | null>;
  findByCustomerId(customerId: string): Promise<Invoice[]>;
  save(invoice: Invoice): Promise<Invoice>;
}

export interface CreditRepository {
  save(credit: Credit): Promise<Credit>;
  deleteByCustomerId(customerId: string): Promise<number>;
}

export interface RefundRepository {
  save(refund: Refund): Promise<Refund>;
}

export interface BillingAccountRepository {
  findByCustomerId(customerId: string): Promise<BillingAccount | null>;
  save(account: BillingAccount): Promise<BillingAccount>;
  updatePlan(customerId: string, plan: BillingPlan): Promise<BillingAccount>;
}
