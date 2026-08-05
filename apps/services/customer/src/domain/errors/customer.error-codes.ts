export const CustomerErrorCodes = {
  ALREADY_EXISTS: { code: 'CUSTOMER_ALREADY_EXISTS', httpStatus: 409 },
  NOT_FOUND: { code: 'CUSTOMER_NOT_FOUND', httpStatus: 404 },
} as const;
