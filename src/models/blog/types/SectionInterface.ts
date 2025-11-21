import { ProductInfo, ProductInfoSchema } from '@/models/product/types/productInfo';
import mongoose from 'mongoose';

/**
 * Blog section interface with multilingual subtitle and content.
 * Uses ProductInfo (which is now MultilingualString) for type consistency.
 */
export interface SectionInterface {
  subtitle: ProductInfo;
  content: ProductInfo;
}

// Section Schema for blog posts
export const SectionSchema = new mongoose.Schema<SectionInterface>({
  subtitle: {
    type: ProductInfoSchema,
    required: true,
  },
  content: {
    type: ProductInfoSchema,
    required: true,
  },
});
