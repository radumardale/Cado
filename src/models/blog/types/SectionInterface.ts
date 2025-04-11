import { ProductInfo, ProductInfoSchema } from "@/models/product/types/productInfo";
import mongoose from "mongoose";

export interface SectionInterface {
    subtitle: ProductInfo,
    content: ProductInfo
}

// Normal Address Schema
export const SectionSchema = new mongoose.Schema<SectionInterface>({
    subtitle: {
        type: ProductInfoSchema,
        required: true,
    },
    content: {
        type: ProductInfoSchema,
        required: true
    }
});