import { ClientEntity } from "./orderEntity";
import mongoose from "mongoose";
import { Address, AddressSchema } from "./address";
import { UserDataInterface, UserDataSchema } from "./userData";
import { BillingAddress, BillingAddressSchema } from "./billingAddress";
import { NormalAddress } from "./normalAddress";
import { LegalAddress } from "./legalAddress";

export interface AdditionalInfoInterface {
    user_data: UserDataInterface,
    delivery_address?: Address,
    billing_address: BillingAddress,
    entity_type: ClientEntity,
}

export interface ResAdditionalInfoInterface {
  user_data: UserDataInterface,
  delivery_address?: Address,
  billing_checkbox: boolean,
  billing_address: NormalAddress | LegalAddress,
  entity_type: ClientEntity,
}

// Additional Info schema
export const AdditionalInfoSchema = new mongoose.Schema<AdditionalInfoInterface>({
  user_data: {
    type: UserDataSchema,
    required: true
  },
  delivery_address: {
    type: AddressSchema,
    required: false,
  },
  billing_address: {
    type: BillingAddressSchema,
    required: true
  },
  entity_type: {
    type: String,
    enum: ClientEntity,
    required: true
  },
},  { _id: false });
