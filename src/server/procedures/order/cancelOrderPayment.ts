/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { Order } from "@/models/order/order";
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import { z } from "zod";
import { OrderState } from "@/models/order/types/orderState";
import { Product } from "@/models/product/product";

export const cancelOrderProcedure = publicProcedure
    .input(z.object({ id: z.string().length(24, "ID must be exactly 24 characters long") }))
    .mutation(async ({ input }): Promise<ActionResponse> => {
        try {
            await connectMongo();

            // Check if order is already cancelled
            const order = await Order.findById(input.id);
            if (!order) {
                return {
                    success: false,
                    error: "Order not found"
                };
            }

            if (order.state === OrderState.TransactionFailed) {
                return {
                    success: true
                };
            }

            order.state = OrderState.TransactionFailed;
            await order.save();

            // Update product stock quantities
            for (const orderProduct of order.products) {
                await Product.findOneAndUpdate(
                { _id: orderProduct.product._id },
                { $inc: { "stock_availability.stock": orderProduct.quantity } }
                );
            }

            return {
                success: true
            };
        } catch (error: any) {
            console.error("Error canceling order:", error);
            return {
                success: false,
                error: error.message || "Failed to cancel order"
            };
        }
    });