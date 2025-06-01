import mongoose from "mongoose";
import { Ocasions } from "@/lib/enums/Ocasions";
import { HomeOcasionI } from "./types/HomeOcasionI";
import { ProductInfoSchema } from "../product/types/productInfo";

// Product Schema
const HomeOcasionSchema = new mongoose.Schema<HomeOcasionI>({
    title: {
        type: ProductInfoSchema
    },
    ocasion: {
        type: String,
        enum: Ocasions,
        required: true
    }
});

const HomeOcasion = mongoose.models.HomeOcasion || mongoose.model<HomeOcasionI>("HomeOcasion", HomeOcasionSchema);

export { HomeOcasion };