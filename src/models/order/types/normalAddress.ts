import { Address } from "./address";
import mongoose from "mongoose";

export interface NormalAddress extends Address {
    firstname: string,
    lastname: string,
    tel_number: string,
}

// Normal Address Schema
export const NormalAddressSchema = new mongoose.Schema<NormalAddress>({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    tel_number: {
        type: String,
        required: true,
    }
});