/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { Client } from "@/models/client/client";
import { Order } from "@/models/order/order";
import { OrderInterface } from "@/models/order/types/orderInterface";
import { ActionResponse } from "@/lib/types/ActionResponse";
import { addOrderRequestSchema } from "@/lib/validation/order/addOrderRequest";
import connectMongo from "@/lib/connect-mongo";

export interface addOrderResponse extends ActionResponse {
  order: OrderInterface | null
}

export const addOrderProcedure = publicProcedure
  .input(addOrderRequestSchema)
  .mutation(async ({ input }): Promise<addOrderResponse> => {
    try {
      await connectMongo();

      const client = await Client.findOneAndUpdate(
        { email: input.additional_info.user_data.email }, 
        {}, 
        { upsert: true, new: true }
      );

      if (!client) {
        return {
          success: false,
          error: "Client not found",
          order: null
        };
      }

      const order = await Order.create({
        products: input.products,
        client: client._id,
        additional_info: input.additional_info,
        payment_method: input.payment_method
      });

      client.orders.push(order._id.toString());
      await client.save();

      return {
        success: true,
        order: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create order",
        order: null
      };
    }
  });