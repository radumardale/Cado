/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from '../../trpc';
import { Product } from '@/models/product/product';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from '@/lib/connect-mongo';
import { getRecProductsRequestSchema } from '@/lib/validation/product/getRecProductsRequest';

export interface getProductResponseInterface extends ActionResponse {
  products: any;
}

export const getSimilarProducts = publicProcedure
  .input(getRecProductsRequestSchema)
  .query(async ({ input }): Promise<getProductResponseInterface> => {
    try {
      await connectMongo();

      const excludeFilter = input.productId ? { custom_id: { $ne: input.productId } } : {};

      const products = await Product.aggregate([
        // Filter out the current product
        { $match: excludeFilter },

        // Calculate relevance score - higher is better
        {
          $addFields: {
            relevance: {
              $sum: [
                // Category match - highest priority (score 5)
                {
                  $cond: [
                    { $in: [input.category, '$categories'] },
                    5, // Higher score for category match
                    0,
                  ],
                },
                // Random factor for tie-breaking - low priority (score 0-1)
                { $rand: {} },
              ],
            },
          },
        },

        // Only include products with some relevance
        { $match: { relevance: { $gt: 0 } } },

        // Remove fields we don't need
        {
          $project: {
            description: 0,
            long_description: 0,
            set_description: 0,
          },
        },

        // Sort by relevance (descending)
        {
          $sort: {
            relevance: -1,
          },
        },

        // Take the top 5
        {
          $limit: 5,
        },
      ]);

      if (!products || products.length === 0) {
        // Fall back to returning any 5 products if no similar ones found
        const fallbackProducts = await Product.find(excludeFilter)
          .select('-description -long_description -set_description')
          .limit(5);

        return {
          success: true,
          products: fallbackProducts,
        };
      }

      return {
        success: true,
        products: products,
      };
    } catch (error) {
      console.error('Error fetching similar products:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch similar products',
        products: null,
      };
    }
  });
