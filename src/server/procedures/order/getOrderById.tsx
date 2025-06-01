import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { Order } from '@/models/order/order';
import { ResOrderInterface } from '@/models/order/types/orderInterface';
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import mongoose from "mongoose";

// Define the input schema
export const getOrderRequestSchema = z.object({
  id: z.string()
});

// Define the response interface for TypeScript type checking
export interface getOrderResponseInterface extends ActionResponse {
  order: ResOrderInterface | null
}

export const getOrderByIdProcedure = publicProcedure
  .input(getOrderRequestSchema)
  .query(async ({input}): Promise<getOrderResponseInterface> => {
    try {
      await connectMongo();
      
      // Check if input.id is a valid ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(input.id);
      
      // Prepare the query based on whether the ID is an ObjectId or custom_id
      const query = isValidObjectId ? 
        { _id: input.id } : 
        { custom_id: input.id };
      
      // Use aggregate to get order with populated products and client
      const orderData = await Order.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "clients",
            localField: "client",
            foreignField: "_id",
            as: "clientData"
          }
        },
        { $unwind: { path: "$clientData", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "products",
            localField: "products",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { $limit: 1 }
      ]);

      // Extract the order from results
      const order = orderData && orderData.length > 0 ? orderData[0] : null;

      if (!order) {
        return {
          success: false,
          error: "This order does not exist",
          order: null
        };
      }

      return {
        success: true,
        order
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch order",
        order: null
      };
    }
  });