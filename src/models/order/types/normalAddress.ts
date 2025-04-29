import { Address } from "./address";
import mongoose from "mongoose";

export interface NormalAddress extends Address {
    firstname: string,
    lastname: string,
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
    city: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    home_address: {
        type: String,
        required: true
    },
    home_nr: {
        type: String,
        required: false
    },
},  { _id: false });