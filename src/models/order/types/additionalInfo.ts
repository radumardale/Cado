import { ClientEntity } from "./orderEntity";
import { LegalAddress, LegalAddressSchema } from "./legalAddress";
import { NormalAddress, NormalAddressSchema } from "./normalAddress";
import mongoose from "mongoose";

export interface AdditionalInfoInterface {
    delivery_address?: NormalAddress,
    billing_address: NormalAddress | LegalAddress,
    enitity_type: ClientEntity,
}

// Additional Info schema
export const AdditionalInfoSchema = new mongoose.Schema<AdditionalInfoInterface>({
    delivery_address: {
        type: NormalAddressSchema,
        required: false,
      },
      billing_address: {
        type: LegalAddressSchema,
        required: true
      },
      enitity_type: {
        type: String,
        enum: ClientEntity,
        required: true
      },
});