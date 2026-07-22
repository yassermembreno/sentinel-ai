import { CustomerStatus, CustomerTier } from '@customer/domain/customer.js';

export type CustomerResponseDto = Readonly<{
  id: string;
  name: string;
  email: string;
  tier: CustomerTier;
  status: CustomerStatus;
}>;
