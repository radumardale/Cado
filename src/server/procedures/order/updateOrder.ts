/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { ActionResponse } from '@/lib/types/ActionResponse';
import { updateOrderRequestSchema } from '@/lib/validation/order/updateOrderRequest';
import { Order } from '@/models/order/order';
import { OrderInterface } from '@/models/order/types/orderInterface';
import { Client } from '@/models/client/client';

export interface updateOrderResponse extends ActionResponse {
  order: OrderInterface | null
}

export const updateOrderProcedure = publicProcedure
  .input(updateOrderRequestSchema)
  .mutation(async ({ input }): Promise<updateOrderResponse> => {
    try {

      const client = await Client.findOneAndUpdate(
        { email: input.email }, 
        {}, 
        { upsert: true, new: true }
      );

      const newOrderObject = {
        additional_info: input.additional_info,
        client: client?._id.toString(),
        payment_method: input.payment_method,
        products: input.products,
        state: input.state
      }

      const order = await Order.findByIdAndUpdate(input.id, newOrderObject, { new: true });

      if (!order) {
        return {
          success: false,
          error: "Order not found",
          order: null
        };
      }

      return {
        success: true,
        order: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update order",
        order: null
      };
    }
  });