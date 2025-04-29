/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "../../trpc";
import { Product } from '@/models/product/product';
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import { getAllProductsRequestSchema } from "@/lib/validation/product/getAllProductsRequest";
import SortBy from "@/lib/enums/SortBy";

export interface GetProductResponseInterface extends ActionResponse {
  products: any,
  productsCount: number
}

// trpc server procedure
export const getProductsProcedure = publicProcedure
  .input(getAllProductsRequestSchema)
  .query(async ({ input }) => { 
    try {
      await connectMongo();
    
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const normalizedSearch = input.title ? input.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase() : null;
  
      const tokenizedNormalizedSearch = normalizedSearch ? normalizedSearch.split("+").filter(word => word.length > 1) : null;

      const aggregationResults = await Product.aggregate([
        {
          $match: {
            ...(input.price ? {
              price: {
                $gte: input.price.min,
                $lte: input.price.max
              }
            } : {})
          }
        },
        {
          $set: {
        relevance: {
          $add: [
            {
          $sum: (tokenizedNormalizedSearch || []).map(word => ({
            $cond: {
              if: {
            $or: [
              { $regexMatch: { input: "$normalized_title.ro", regex: word } },
              { $regexMatch: { input: "$normalized_title.ru", regex: word } }
            ]
              },
              then: 5,
              else: 0
            }
          }))
            },
            {
          $cond: [
            { $in: [input.category, "$categories"] },
            1,
            0
          ]
            },
            {
          $cond: [
            { $and: [
              { $isArray: ["$ocasions"] },
              { $gt: [{ $size: { $ifNull: [input.ocasions, []] } }, 0] }
            ]},
            {
              $size: {
            $setIntersection: [
              { $ifNull: ["$ocasions", []] },
              { $ifNull: [input.ocasions, []] }
            ]
              }
            },
            0
          ]
            },
            {
          $cond: [
            { $and: [
              { $isArray: ["$product_content"] },
              { $gt: [{ $size: { $ifNull: [input.productContent, []] } }, 0] }
            ]},
            {
              $size: {
            $setIntersection: [
              { $ifNull: ["$product_content", []] },
              { $ifNull: [input.productContent, []] }
            ]
              }
            },
            0
          ]
            }
          ]
        }
          }
        },
        {
          $facet: {
            products: [
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
            relevantCount: [
              { $match: { relevance: { $gt: 0 } } },
              { $count: "count" }
            ]
          }
        }
      ]);
      
      const products = aggregationResults[0].products || [];
      const totalCount = aggregationResults[0].totalCount[0]?.count || 0;
      const relevantCount = aggregationResults[0].relevantCount[0]?.count || 0;
            
      const hasNextPage = products.length > limit;
      const nextCursor = hasNextPage ? (cursor || 0) + limit : null;
      
      return {
        products: products.slice(0, limit),
        productsCount: relevantCount,
        nextCursor,
        totalCount
      };

    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
    
  });

  function getSortOptions(sortBy: SortBy): Record<string, 1 | -1> {
    switch (sortBy) {
      case SortBy.PRICE_ASC:
        return { price: 1 };
      case SortBy.PRICE_DESC:
        return { price: -1 };
      case SortBy.LATEST:
        return { createdAt: -1 };
      default:
        return { _id: 1 }; // Default sort
    }
  }