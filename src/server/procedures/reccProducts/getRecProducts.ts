/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "../../trpc";
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import { ReccProduct } from "@/models/reccProduct/ReccProduct";

export interface getProductResponseInterface extends ActionResponse {
  products: any
}

export const getRecProductsProcedure = publicProcedure
  .query(async (): Promise<getProductResponseInterface> => {
    try {

      await connectMongo();
      
      const products = await ReccProduct.find()
      .populate({
        path: 'product',
        select: '_id title price images custom_id stock_availability sale'
      })
      .sort({
        index: 1
      })
      .lean();

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