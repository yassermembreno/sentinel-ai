import { CustomerTier } from '@customer/domain/customer.js';

export type CreateCustomerDto = Readonly<{
  name: string;
  email: string;
  tier: CustomerTier;
}>;
