export enum InvoiceStatus {
  OPEN = 'OPEN',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum BillingPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum RefundStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type Invoice = {
  id: string;
  customerId: string;
  amount: number;
  status: InvoiceStatus;
  plan: BillingPlan;
};

export type Credit = {
  id: string;
  customerId: string;
  amount: number;
  reason: string | null;
  createdAt: Date;
};

export type Refund = {
  id: string;
  customerId: string;
  invoiceId: string | null;
  amount: number;
  status: RefundStatus;
  createdAt: Date;
};

export type BillingAccount = {
  customerId: string;
  plan: BillingPlan;
};
