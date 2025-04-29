import mongoose from "mongoose";

export interface UserDataInterface {
    email: string,
    firstname: string,
    lastname: string,
    tel_number: string,
}

// Additional Info schema
export const UserDataSchema = new mongoose.Schema<UserDataInterface>({
    email: {
        type: String,
        required: true,
    },
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