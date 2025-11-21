import mongoose from 'mongoose';

/**
 * Multilingual product information text.
 * Uses the global MultilingualString type to ensure consistency.
 *
 * @deprecated Importing this type is no longer needed - use global MultilingualString instead.
 */
export type ProductInfo = MultilingualString;

// ProductInfo Schema
export const ProductInfoSchema = new mongoose.Schema<ProductInfo>(
  {
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
  },
  { _id: false }
);
