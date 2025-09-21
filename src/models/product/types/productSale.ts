import mongoose from 'mongoose';

export type ProductSale = {
  active: boolean;
  sale_price: number;
};

export const SaleSchema = new mongoose.Schema<ProductSale>({
  active: {
    type: Boolean,
    required: true,
  },
  sale_price: {
    type: Number,
    required: true,
  },
});
