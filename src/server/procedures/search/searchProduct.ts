/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from '@/server/trpc';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { searchProductRequestSchema } from '@/lib/validation/search/searchProductRequest';
import { Product } from '@/models/product/product';

export interface searchProductResponseInterface extends ActionResponse {
  products: any[] | [];
  count: number;
}

export const searchProductProcedure = publicProcedure
  .input(searchProductRequestSchema)
  .query(async ({ input }): Promise<searchProductResponseInterface> => {
    const normalizedSearch = input.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const tokenizedNormalizedSearch = normalizedSearch.split(/\s+/).filter(word => word.length > 1);

    if (tokenizedNormalizedSearch.length === 0) {
      return {
        success: true,
        products: [],
        count: 0,
      };
    }

    try {
      const results = await Product.aggregate([
        {
          $match: {
            $or: tokenizedNormalizedSearch.map(word => ({
              $or: [
                { 'normalized_title.ro': { $regex: word } },
                { 'normalized_title.ru': { $regex: word } },
              ],
            })),
          },
        },
        // Then add a basic scoring field counting matches
        {
          $addFields: {
            score: {
              $sum: tokenizedNormalizedSearch.map(word => ({
                $cond: {
                  if: {
                    $or: [
                      { $regexMatch: { input: '$normalized_title.ro', regex: word } },
                      { $regexMatch: { input: '$normalized_title.ru', regex: word } },
                    ],
                  },
                  then: 1,
                  else: 0,
                },
              })),
            },
          },
        },
        { $sort: { score: -1 } },
        {
          $facet: {
            products: [
              { $limit: 5 },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  images: 1,
                  price: 1,
                  sale: 1,
                  custom_id: 1,
                  stock_availability: 1,
                },
              },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);

      if (!results[0].products || results[0].products.length === 0) {
        return {
          success: true,
          error: 'This product does not exist',
          products: [],
          count: 0,
        };
      }

      return {
        success: true,
        products: results[0].products,
        count: results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to search products',
        products: [],
        count: 0,
      };
    }
  });
