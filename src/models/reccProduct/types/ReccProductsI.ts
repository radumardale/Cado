import { ProductInterface } from '@/models/product/types/productInterface';
import { Types } from 'mongoose';

export interface ReccProductsI {
  product: Types.ObjectId;
  index: number;
}

export interface PopulatedReccProductsI {
  product: ProductInterface;
  index: number;
}
