/* eslint-disable  @typescript-eslint/no-explicit-any */

import { protectedProcedure } from "@/server/trpc";
import { ActionResponse } from '@/lib/types/ActionResponse';
import { deleteOrderRequestSchema } from '@/lib/validation/order/deleteOrderRequest';
import { Order } from '@/models/order/order';
import connectMongo from "@/lib/connect-mongo";

export const deleteOrderProcedure = protectedProcedure
  .input(deleteOrderRequestSchema)
  .mutation(async ({ input }): Promise<ActionResponse> => {
    try {
      await connectMongo();

      await Order.findByIdAndDelete(input.id);

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to delete order",
      };
    }
  });