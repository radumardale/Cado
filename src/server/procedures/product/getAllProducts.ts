/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from '../../trpc';
import { Product } from '@/models/product/product';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from '@/lib/connect-mongo';

export interface getProductResponseInterface extends ActionResponse {
  products: any;
}

export const getAllProductsProcedure = publicProcedure.query(
  async (): Promise<getProductResponseInterface> => {
    try {
      await connectMongo();

      const products = await Product.find();

      if (!products) {
        return {
          success: false,
          error: 'This product does not exist',
          products: null,
        };
      }

      return {
        success: true,
        products: products,
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        products: null,
      };
    }
  }
);
