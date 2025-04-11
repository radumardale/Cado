/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "../../trpc";
import { Product } from '@/models/product/product';
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import { getAllProductsRequestSchema } from "@/lib/validation/product/getAllProductsRequest";
import SortBy from "@/lib/enums/SortBy";

export interface GetProductResponseInterface extends ActionResponse {
  products: any
}

// trpc server procedure
export const getProductsProcedure = publicProcedure
  .input(getAllProductsRequestSchema)
  .query(async ({ input }) => {

    await connectMongo();
    
    const limit = input.limit ?? 10;
    const { cursor } = input;
    
    const filter: any = {};
    
    // Add filters
    if (input.category) {
      filter.categories = input.category;
    }
    
    if (input.ocasions && input.ocasions.length > 0) {
      filter.ocasions = { $in: input.ocasions };
    }
    
    if (input.productContent && input.productContent.length > 0) {
      filter.product_content = { $in: input.productContent };
    }
    
    filter.price = {
      $gte: input.price.min,
      $lte: input.price.max
    };
    
    // Determine sort order
    let sortOptions = {};
    switch (input.sortBy) {
      case SortBy.PRICE_ASC:
        sortOptions = { price: 1 };
        break;
      case SortBy.PRICE_DESC:
        sortOptions = { price: -1 };
        break;
      case SortBy.LATEST:
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { _id: 1 }; // Default sort
    }
    
    const totalCount = await Product.countDocuments(filter);
    
    // Get items plus one to check if there are more
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(cursor || 0)
      .limit(limit + 1);
      
    // Check if there are more items
    const hasNextPage = products.length > limit;
    const nextCursor = hasNextPage ? (cursor || 0) + limit : null;
    
    return {
      products: products.slice(0, limit),
      nextCursor,
      totalCount
    };
  });