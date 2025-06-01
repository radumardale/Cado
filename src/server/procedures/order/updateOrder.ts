/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { Client } from "@/models/client/client";
import { Order } from "@/models/order/order";
import { ActionResponse } from "@/lib/types/ActionResponse";
import { updateOrderRequestSchema } from '@/lib/validation/order/updateOrderRequest';
import connectMongo from "@/lib/connect-mongo";
import { DeliveryMethod } from "@/models/order/types/deliveryMethod";

export interface updateOrderResponse extends ActionResponse {
  order: any | null
}

export const updateOrderProcedure = publicProcedure
  .input(updateOrderRequestSchema)
  .mutation(async ({ input }): Promise<updateOrderResponse> => {
    try {
      await connectMongo();

      let billingAddress;
      if (input.additional_info.billing_checkbox) {
            billingAddress = {
              billing_type: input.additional_info.entity_type,
              region: input.additional_info.delivery_address.region,
              city: input.additional_info.delivery_address.city,
              home_address: input.additional_info.delivery_address.home_address,
              home_nr: input.additional_info.delivery_address.home_nr,
              firstname: input.additional_info.user_data.firstname,
              lastname: input.additional_info.user_data.lastname,
          };
      } else {
        billingAddress = input.additional_info.billing_address;
        Object.assign(billingAddress, {billing_type: input.additional_info.entity_type})
      }

      const additionalInfo = {
        billing_checkbox: input.additional_info.billing_checkbox,
        user_data: input.additional_info.user_data,
        billing_address: billingAddress,
        entity_type: input.additional_info.entity_type
      }

      if (input.delivery_method === DeliveryMethod.HOME_DELIVERY) {
        Object.assign(additionalInfo, {delivery_address: input.additional_info.delivery_address})
      }

      const deliveryDetails = {
        hours_intervals: input.delivery_details.hours_intervals,
        message: input.delivery_details.message,
        comments: input.delivery_details.comments,
      }

      if (input.delivery_details.delivery_date) Object.assign(deliveryDetails, {delivery_date: new Date(input.delivery_details.delivery_date)})

      const client = await Client.findOneAndUpdate(
        { 
          email: input.additional_info.user_data.email,
        }, 
        {
          firstname: input.additional_info.user_data.firstname,
          lastname: input.additional_info.user_data.lastname,
          tel_number: input.additional_info.user_data.tel_number,
        }, 
        { upsert: true, new: true }
      );

      if (!client) {
        return {
          success: false,
          error: "Client not found",
          order: null
        };
      }

      // Update the order
      const order = await Order.findByIdAndUpdate(
        input.id,
        {
          products: input.products,
          client: client._id,
          additional_info: additionalInfo,
          payment_method: input.payment_method,
          delivery_method: input.delivery_method,
          total_cost: input.total_cost || 0,
          delivery_details: deliveryDetails,
        },
        { new: true }
      );

      if (!order) {
        return {
          success: false,
          error: "Order not found",
          order: null
        };
      }

      // Check if client already has this order
      if (!client.orders.includes(order._id.toString())) {
        client.orders.push(order._id.toString());
        await client.save();
      }

      const plainOrder = order.toObject ? order.toObject() : order;

      // Add the billing_checkbox field to the response
      if (plainOrder.additional_info) {
        (plainOrder.additional_info as any).billing_checkbox = input.additional_info.billing_checkbox;
      }
      
      return {
        success: true,
        order: plainOrder
      };
    } catch (error: any) {
      console.error("Error updating order:", error);
      return {
        success: false,
        error: error.message || "Failed to update order",
        order: null
      };
    }
  });