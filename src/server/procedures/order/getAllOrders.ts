/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from '@/server/trpc';
import { Order } from '@/models/order/order';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from '@/lib/connect-mongo';
import { z } from 'zod';
import { OrderState } from '@/models/order/types/orderState';
import SortBy from '@/lib/enums/SortBy';

// Define the request schema
export const getAdminOrdersRequestSchema = z.object({
  searchQuery: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  state: z.nativeEnum(OrderState).optional(),
  limit: z.number().min(1).max(100).optional().default(10),
  cursor: z.number().optional(),
  sortBy: z.nativeEnum(SortBy).optional().default(SortBy.LATEST),
});

export interface getAllOrdersResponseInterface extends ActionResponse {
  orders: any[];
  nextCursor: number | null;
  totalCount: number;
}

export const getAllOrdersProcedure = publicProcedure
  .input(getAdminOrdersRequestSchema)
  .query(async ({ input }): Promise<getAllOrdersResponseInterface> => {
    try {
      await connectMongo();

      const limit = input.limit ?? 10;
      const { cursor } = input;

      // Normalize search query
      const normalizedSearch = input.searchQuery
        ? input.searchQuery
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
        : null;

      // Tokenize search query
      const tokenizedNormalizedSearch = normalizedSearch
        ? normalizedSearch.split('+').filter(word => word.length > 1)
        : null;

      // Create date filter conditions
      let dateFilter = {};
      if (input.startDate && input.endDate) {
        dateFilter = {
          createdAt: {
            $gte: new Date(input.startDate),
            $lte: new Date(input.endDate),
          },
        };
      } else if (input.startDate) {
        dateFilter = { createdAt: { $gte: new Date(input.startDate) } };
      } else if (input.endDate) {
        dateFilter = { createdAt: { $lte: new Date(input.endDate) } };
      }

      // Create order state filter
      // Aggregate orders with search, filters and pagination
      const aggregationResults = await Order.aggregate([
        {
          $lookup: {
            from: 'clients',
            localField: 'client',
            foreignField: '_id',
            as: 'clientData',
          },
        },
        { $unwind: { path: '$clientData', preserveNullAndEmptyArrays: true } },
        {
          $match: {
            // Apply date and state filters
            ...dateFilter,
            // Apply text search if provided
            ...(tokenizedNormalizedSearch && tokenizedNormalizedSearch.length > 0
              ? {
                  $or: [
                    // Search in client email
                    // { "clientData.email": { $regex: tokenizedNormalizedSearch.join("|"), $options: "i" } },
                    { custom_id: { $regex: tokenizedNormalizedSearch.join('|'), $options: 'i' } },
                    // Search in additional info user data
                    {
                      'additional_info.user_data.email': {
                        $regex: tokenizedNormalizedSearch.join('|'),
                        $options: 'i',
                      },
                    },
                    {
                      'additional_info.user_data.tel_number': {
                        $regex: tokenizedNormalizedSearch.join('|'),
                        $options: 'i',
                      },
                    },
                  ],
                }
              : {}),
          },
        },
        {
          $set: {
            relevance: {
              $add: [
                // Calculate search relevance score
                {
                  $cond: {
                    if: { $eq: [{ $size: { $ifNull: [tokenizedNormalizedSearch, []] } }, 0] },
                    then: 0,
                    else: {
                      $sum: (tokenizedNormalizedSearch || []).map(word => ({
                        $cond: {
                          if: {
                            $or: [
                              {
                                $regexMatch: {
                                  input: { $ifNull: ['$clientData.email', ''] },
                                  regex: word,
                                  options: 'i',
                                },
                              },
                              {
                                $regexMatch: {
                                  input: { $ifNull: ['$additional_info.user_data.email', ''] },
                                  regex: word,
                                  options: 'i',
                                },
                              },
                              {
                                $regexMatch: {
                                  input: { $ifNull: ['$additional_info.user_data.firstname', ''] },
                                  regex: word,
                                  options: 'i',
                                },
                              },
                              {
                                $regexMatch: {
                                  input: { $ifNull: ['$additional_info.user_data.lastname', ''] },
                                  regex: word,
                                  options: 'i',
                                },
                              },
                            ],
                          },
                          then: 1,
                          else: 0,
                        },
                      })),
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $facet: {
            orders: [
              {
                $sort: {
                  relevance: -1,
                  ...getSortOptions(input.sortBy),
                },
              },
              { $skip: cursor || 0 },
              { $limit: limit + 1 },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);

      const orders = aggregationResults[0].orders || [];
      const totalCount = aggregationResults[0].totalCount[0]?.count || 0;

      const hasNextPage = orders.length > limit;
      const nextCursor = hasNextPage ? (cursor || 0) + limit : null;

      return {
        success: true,
        orders: orders.slice(0, limit),
        nextCursor,
        totalCount,
      };
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch orders',
        orders: [],
        nextCursor: null,
        totalCount: 0,
      };
    }
  });

function getSortOptions(sortBy: SortBy): Record<string, 1 | -1> {
  switch (sortBy) {
    case SortBy.PRICE_ASC:
      return { total_cost: 1 };
    case SortBy.PRICE_DESC:
      return { total_cost: -1 };
    case SortBy.LATEST:
      return { createdAt: -1 };
    case SortBy.OLDEST:
      return { createdAt: 1 };
    default:
      return { createdAt: -1 }; // Default sort by newest
  }
}
