import mongoose from 'mongoose';

export interface BillingAddress {
  name: string;
}

// Legal Address Schema
export const BillingAddressSchema = new mongoose.Schema<BillingAddress>(
  { name: String },
  { discriminatorKey: 'billing_type' }
);
