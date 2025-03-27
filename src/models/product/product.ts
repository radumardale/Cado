import mongoose from "mongoose";
import { ProductInfoSchema } from "./types/productInfo";
import { SaleSchema } from "./types/productSale";
import { ProductInterface } from "./types/productInterface";
import { Categories } from "@/lib/enums/Categories";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";

// Product Schema
const ProductSchema = new mongoose.Schema<ProductInterface>({
  title: {
    type: ProductInfoSchema,
    required: true,
  },
  description: {
    type: ProductInfoSchema,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categories: {
    type: [String],
    enum: Categories,
    required: true,
  },
  ocasions: {
    type: [String],
    enum: Ocasions,
    required: true,
  },
  product_content: {
    type: [String],
    enum: ProductContent,
    required: true,
  },
  stock_availability: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  sale: {
    type: SaleSchema,
    required: true,
  },
});

// Index for title.ro and title.ru
ProductSchema.index({ "title.ro": 1, "title.ru": 1 });

const Product = mongoose.models.Product || mongoose.model<ProductInterface>("Product", ProductSchema);

export { Product };