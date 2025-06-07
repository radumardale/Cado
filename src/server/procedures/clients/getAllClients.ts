/* eslint-disable  @typescript-eslint/no-explicit-any */

import { protectedProcedure } from "@/server/trpc";
import { Client } from '@/models/client/client';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from "@/lib/connect-mongo";
import { z } from "zod";
import SortBy from "@/lib/enums/SortBy";

// Define the request schema
export const getAdminOrdersRequestSchema = z.object({
  searchQuery: z.string().optional(),
  limit: z.number().min(1).max(100).optional().default(10),
  cursor: z.number().optional(),
  sortBy: z.nativeEnum(SortBy).optional().default(SortBy.LATEST)
});

export interface getAllOrdersResponseInterface extends ActionResponse {
  clients: any[],
  nextCursor: number | null,
  totalCount: number
}

export const getAllClientsProcedure = protectedProcedure
  .input(getAdminOrdersRequestSchema)
  .query(async ({ input }): Promise<getAllOrdersResponseInterface> => {    
    try {
      await connectMongo();
      
      const limit = input.limit ?? 10;
      const { cursor } = input;
      
      const normalizedSearch = input.searchQuery 
        ? input.searchQuery
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
        : null;
      
      const tokenizedNormalizedSearch = normalizedSearch 
        ? normalizedSearch.split("+").filter(word => word.length > 1) 
        : null;

      const aggregationResults = await Client.aggregate([
        {
          $match: {
            ...(tokenizedNormalizedSearch && tokenizedNormalizedSearch.length > 0 ? 
              { "email": { $regex: tokenizedNormalizedSearch.join("|"), $options: "i" } }
              : {})
          }
        },
        {
          $set: {
            relevance: {
              $add: [
                {
                  $cond: {
                    if: { $eq: [{ $size: { $ifNull: [tokenizedNormalizedSearch, []] } }, 0] },
                    then: 0,
                    else: {
                      $sum: (tokenizedNormalizedSearch || []).map(word => ({
                        $cond: {
                          if: {
                            $regexMatch: { input: { $ifNull: ["$email", ""] }, regex: word, options: "i" }
                          },
                          then: 1,
                          else: 0
                        }
                      }))
                    }
                  }
                }
              ]
            },
            ordersCount: { $size: "$orders" },
          }
        },
        {
          $facet: {
            clients: [
              { 
                $sort: {
                  relevance: -1,
                  ...getSortOptions(input.sortBy)
                }
              },
              { $skip: cursor || 0 },
              { $limit: limit + 1 }
            ],
            totalCount: [
              { $count: "count" }
            ],
          }
        }
      ]);

      const totalCount = aggregationResults[0].totalCount[0]?.count || 0;
            
      const hasNextPage = aggregationResults.length > limit;
      const nextCursor = hasNextPage ? (cursor || 0) + limit : null;
      
      return {
        success: true,
        clients: aggregationResults[0].clients.slice(0, limit),
        nextCursor,
        totalCount
      };
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch orders",
        clients: [],
        nextCursor: null,
        totalCount: 0
      }
    }
  });

function getSortOptions(sortBy: SortBy): Record<string, 1 | -1> {
  switch (sortBy) {
    case SortBy.PRICE_ASC:
      return { "ordersCount": 1 };
    case SortBy.PRICE_DESC:
      return { "ordersCount": -1 };
    case SortBy.LATEST:
      return { createdAt: -1 };
    case SortBy.OLDEST:
      return { createdAt: 1 };
    default:
      return { createdAt: -1 }; // Default sort by newest
  }
}