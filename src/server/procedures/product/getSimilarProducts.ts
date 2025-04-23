/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "../../trpc";
import { Product } from '@/models/product/product';
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import { getRecProductsRequestSchema } from "@/lib/validation/product/getRecProductsRequest";

export interface getProductResponseInterface extends ActionResponse {
  products: any
}

export const getSimilarProducts = publicProcedure
    .input(getRecProductsRequestSchema)
  .query(async ({input}): Promise<getProductResponseInterface> => {
    try {

      await connectMongo();

      const products = await Product.aggregate([
        {
          $project: {
            "description": 0,
            "long_description": 0,
            "set_description": 0,
            "ocasions": 0,
            "product_content": 0,
          }
        },
        {
          $set: {
            relevance: {
              $cond: [
                {$in: [input.category, "$categories"]},
                0,
                1
              ]
            }
          }
        },
        {
          $limit: 5
        },
        {
          $sort: {
            relevance: -1
          }
        }
      ]);
      
      if (!products) {
        return {
          success: false,
          error: "This product does not exist",
          products: null
        };
      }

      return {
        success: true,
        products: products
      };
    } catch (error) {
      console.error("Error fetching product:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch product",
        products: null
      };
    }
  });