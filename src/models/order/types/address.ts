import mongoose from "mongoose";

export interface Address {
    country: string,
    region: string,
    city: string,
    home_address: string
}

// Address Schema
export const AddressSchema = new mongoose.Schema<Address>({
    city: {
        type: String,
        required: true
    },
    country: {
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
});