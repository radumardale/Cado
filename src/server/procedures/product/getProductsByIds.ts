/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from '../../trpc';
import { z } from 'zod';
import { Product } from '@/models/product/product';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from '@/lib/connect-mongo';

// Define the input schema to accept an array of product IDs
export const getProductsByIdsRequestSchema = z.object({
  ids: z.array(z.string()),
});

// Define the response interface for TypeScript type checking
export interface getProductsByIdsResponseInterface extends ActionResponse {
  products: any;
}

export const getProductsByIdsProcedure = publicProcedure
  .input(getProductsByIdsRequestSchema)
  .query(async ({ input }): Promise<getProductsByIdsResponseInterface> => {
    try {
      await connectMongo();

      // Handle empty array case
      if (input.ids.length === 0) {
        return {
          success: true,
          products: [],
        };
      }

      // Find all products with IDs in the provided array
      // First try to find by _id (MongoDB ObjectId)
      const products = await Product.find({ custom_id: { $in: input.ids } }).lean();

      if (!products || products.length === 0) {
        return {
          success: false,
          error: 'No products found with the provided IDs',
          products: [],
        };
      }

      return {
        success: true,
        products,
      };
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        products: [],
      };
    }
  });
