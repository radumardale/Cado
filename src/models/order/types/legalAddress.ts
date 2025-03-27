import { Address } from "./address";
import mongoose from "mongoose";

export interface LegalAddress extends Address {
    company_name: string,
    idno: string,
}

// Legal Address Schema
export const LegalAddressSchema = new mongoose.Schema<LegalAddress>({
    company_name: {
        type: String,
        required: true,
    },
    idno: {
        type: String,
        required: true,
    }
});