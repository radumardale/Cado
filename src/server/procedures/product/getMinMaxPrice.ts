import { publicProcedure } from '../../trpc';
import { Product } from '@/models/product/product';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from '@/lib/connect-mongo';

export interface getMinMaxPriceResponseInterface extends ActionResponse {
  minPrice: number | null;
  maxPrice: number | null;
}

export const getMinMaxPriceProcedure = publicProcedure.query(
  async (): Promise<getMinMaxPriceResponseInterface> => {
    try {
      await connectMongo();

      // Use aggregation to calculate min and max prices in the database
      const priceStats = await Product.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]);

      // Check if we have results
      if (!priceStats || priceStats.length === 0) {
        return {
          success: false,
          error: 'No products found',
          minPrice: null,
          maxPrice: null,
        };
      }

      const { minPrice, maxPrice } = priceStats[0];

      return {
        success: true,
        minPrice,
        maxPrice,
      };
    } catch (error) {
      console.error('Error fetching product prices:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product prices',
        minPrice: null,
        maxPrice: null,
      };
    }
  }
);
