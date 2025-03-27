/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { ActionResponse } from '@/lib/types/ActionResponse';
import { searchProductRequestSchema } from '@/lib/validation/search/searchProductRequest';
import { Product } from '@/models/product/product';

type OptimizedProduct = {
    id: string;
    price: number;
    images: string[];
    title: {
        ro: string;
        ru: string;
    };
    sale: {
        active: boolean;
        sale_price: number;
    };
}

export interface searchProductResponseInterface extends ActionResponse {
    products: OptimizedProduct[] | [],
    count: number
}

export const searchProductProcedure = publicProcedure
  .input(searchProductRequestSchema)
  .query(async ({ input }): Promise<searchProductResponseInterface> => {
    try {
      
      const products = await Product.find({
        "title.ro": { $regex: input.title, $options: "i" }
      })
      .limit(5)
      .select("id title images price sale");

      if (!products) {
        return {
          success: false,
          error: "This product does not exist",
          products: [],
          count: 0
        }
      }

      return {
        success: true,
        products: products,
        count: products.length
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to search products",
        products: [],
        count: 0
      };
    }
  });