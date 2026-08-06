import type { BillingPlan, InvoiceStatus, RefundStatus } from '@billing/domain/billing.js';

export type InvoiceResponseDto = Readonly<{
  id: string;
  customerId: string;
  amount: number;
  status: InvoiceStatus;
  plan: BillingPlan;
}>;

export type CreditResponseDto = Readonly<{
  id: string;
  customerId: string;
  amount: number;
  reason: string | null;
  createdAt: string;
}>;

export type RefundResponseDto = Readonly<{
  id: string;
  customerId: string;
  invoiceId: string | null;
  amount: number;
  status: RefundStatus;
  createdAt: string;
}>;

export type BillingAccountResponseDto = Readonly<{
  customerId: string;
  plan: BillingPlan;
}>;
