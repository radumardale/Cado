/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { Order } from '@/models/order/order';
import { ProductInterface } from '@/models/product/types/productInterface';
import { Product } from '@/models/product/product';
import { Client } from '@/models/client/client';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { ClientInterface } from "@/models/client/types/clientInterface";
import connectMongo from "@/lib/connect-mongo";

export interface getAllOrdersResponseInterface extends ActionResponse {
  orders: any
}

export const getAllOrdersProcedure = publicProcedure
  .query(async (): Promise<getAllOrdersResponseInterface> => {    
    try {
      await connectMongo();
      
      const orders = await Order.find({})
        .populate<{ products: ProductInterface[] }>("products", "", Product)
        .populate<{ client: ClientInterface }>("client", "email", Client)
        .lean();

      if (!orders) {
        return {
          success: false,
          error: "No orders found",
          orders: []
        }
      }

      return {
        success: true,
        orders: orders
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch orders",
        orders: []
      }
    }
  });