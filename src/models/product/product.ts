import mongoose from "mongoose";
import { ProductInfoSchema } from "./types/productInfo";
import { SaleSchema } from "./types/productSale";
import { ProductInterface } from "./types/productInterface";
import { Categories } from "@/lib/enums/Categories";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";
import { nanoid } from 'nanoid';

// Product Schema
const ProductSchema = new mongoose.Schema<ProductInterface>({
  custom_id: {
    type: String,
    required: true,
    unique: true,
    default: nanoid(8)
  },
  title: {
    type: ProductInfoSchema,
    required: true,
  },
  description: {
    type: ProductInfoSchema,
    required: true,
  },
  long_description: {
    type: ProductInfoSchema,
    required: true
  },
  set_description: {
    type: ProductInfoSchema,
    required: false
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
    required: false,
  }
});

// Index for title.ro and title.ru
ProductSchema.index({ "title.ro": 1, "title.ru": 1 });
ProductSchema.index({ "categories": 1 });
ProductSchema.index({ "ocasions": 1 });
ProductSchema.index({ "product_content": 1 });

const Product = mongoose.models.Product || mongoose.model<ProductInterface>("Product", ProductSchema);

export { Product };