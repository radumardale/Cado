import mongoose from "mongoose";

export type ProductInfo =  {
    ro: string
    ru: string
    [key: string]: string;
  }

  // ProductInfo Schema
export const ProductInfoSchema = new mongoose.Schema<ProductInfo>({
    ro: {
      type: String,
      required: true,
    },
    ru: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
},  { _id: false });
  