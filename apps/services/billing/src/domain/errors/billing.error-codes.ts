export const BillingErrorCodes = {
  INVOICE_NOT_FOUND: { code: 'INVOICE_NOT_FOUND', httpStatus: 404 },
  ACCOUNT_NOT_FOUND: { code: 'BILLING_ACCOUNT_NOT_FOUND', httpStatus: 404 },
} as const;
