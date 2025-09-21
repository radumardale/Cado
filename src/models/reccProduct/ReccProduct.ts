import mongoose from 'mongoose';
import { ReccProductsI } from './types/ReccProductsI';

// Product Schema
const ReccProductSchema = new mongoose.Schema<ReccProductsI>({
  product: {
    type: 'ObjectId',
    ref: 'Product',
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const ReccProduct =
  mongoose.models.ReccProduct || mongoose.model<ReccProductsI>('ReccProduct', ReccProductSchema);

export { ReccProduct };
