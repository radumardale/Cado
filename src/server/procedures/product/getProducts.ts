/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "../../trpc";
import { Product } from '@/models/product/product';
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import { getAllProductsRequestSchema } from "@/lib/validation/product/getAllProductsRequest";
import { productsLimit } from "@/lib/constants";
import SortBy from "@/lib/enums/SortBy";

export interface GetProductResponseInterface extends ActionResponse {
  products: any
}

export const getProductsProcedure = publicProcedure
  .input(getAllProductsRequestSchema)
  .query(async ({input}): Promise<GetProductResponseInterface> => {
    try {
      
      await connectMongo();

      // Build the filter query based on provided arrays
      const filter: any = {};
      
      // Add category filter if provided
      if (input.categories.length > 0) {
        filter.categories = { $in: input.categories };
      }
      
      // Add occasions filter if provided
      if (input.ocasions.length > 0) {
        filter.ocasions = { $in: input.ocasions };
      }
      
      // Add product content filter if provided
      if (input.productContent.length > 0) {
        filter.product_content = { $in: input.productContent };
      }

      filter.price = {}
      filter.price.$gte = input.price.min;
      filter.price.$lte = input.price.max;

      let query = Product.find(filter);

      switch (input.sortBy) {
        case SortBy.PRICE_ASC:
          query = query.sort({ price: 1 });
          break;
        case SortBy.PRICE_DESC:
          query = query.sort({ price: -1 });
          break;
        case SortBy.RECOMMENDED:
        default:
          query = query.sort({ _id: 1 });
          break;
      }
      
      const products = await query
        .limit(productsLimit)
        .skip(input.chunk * productsLimit)
        .lean();

      if (!products) {
        return {
          success: false,
          error: "Products not found",
          products: null
        };
      }

      return {
        success: true,
        products: products
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
        products: null
      };
    }
  });