import {
  OrderProductInterface,
  OrderProductsSchema,
} from '@/models/product/types/productInterface';
import { Schema } from 'mongoose';

export interface CartProducts {
  product: OrderProductInterface;
  quantity: number;
}

export const CartProductsSchema = new Schema<CartProducts>(
  {
    product: { type: OrderProductsSchema, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);
