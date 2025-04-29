/* eslint-disable  @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import { ProductInfoSchema } from "./types/productInfo";
import { SaleSchema } from "./types/productSale";
import { ProductInterface } from "./types/productInterface";
import { Categories } from "@/lib/enums/Categories";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";
import { nanoid } from 'nanoid';
import { StockAvailabilitySchema } from "./types/stockAvailability";

// Product Schema
const ProductSchema = new mongoose.Schema<ProductInterface>({
  custom_id: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(8)
  },
  title: {
    type: ProductInfoSchema,
    required: true,
  },
  normalized_title: {
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
  image_description: {
    type: ProductInfoSchema,
    required: true
  },
  nr_of_items: {
    type: Number,
    required: true
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
    type: StockAvailabilitySchema,
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
}, { timestamps: true });

ProductSchema.pre<ProductInterface>('save', function(next) {
  this.normalized_title = {
    ro: this.title.ro
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(),
    ru: this.title.ru
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(),
    en: this.title.en
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase(),
  };
  next();
});

ProductSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  
  if (update?.title || update?.$set?.title) {
    const titleData = update.title || update.$set.title;
    
    const normalizedTitle = {
      ro: titleData.ro
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase(),
      ru: titleData.ru
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase(),
      en: titleData.en
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    };
    
    if (update.$set) {
      update.$set.normalized_title = normalizedTitle;
    } else {
      update.normalized_title = normalizedTitle;
    }
  }
  
  next();
});

// Index for title.ro and title.ru
ProductSchema.index({"normalized_title.ro": 1});
ProductSchema.index({ "normalized_title.ru": 1 });
ProductSchema.index({ "categories": 1, "ocasions": 1, "product_content": 1 });

const Product = mongoose.models.Product || mongoose.model<ProductInterface>("Product", ProductSchema);

export { Product };