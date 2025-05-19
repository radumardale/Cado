/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { Client } from "@/models/client/client";
import { Order } from "@/models/order/order";
import { OrderInterface, ResOrderInterface } from "@/models/order/types/orderInterface";
import { ActionResponse } from "@/lib/types/ActionResponse";
import { addOrderRequestSchema } from "@/lib/validation/order/addOrderRequest";
import connectMongo from "@/lib/connect-mongo";
import { DeliveryMethod  } from "@/models/order/types/deliveryMethod";
import nodemailer from 'nodemailer';
import { render } from "@react-email/components";
import OrderConfirmation from "@/components/emails/OrderConfirmation";

const mailConfig = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
};

const subjectLang = new Map([
  ["en", "TRIP REMINDER | World Wide Travel"],
  ["ro", "REAMINTIRE DE CĂLĂTORIE | World Wide Travel"],
  ["fr", "RAPPEL DE VOYAGE | World Wide Travel"],
  ["ru", "НАПОМИНАНИЕ О ПОЕЗДКЕ | World Wide Travel"]
])

export interface addOrderResponse extends ActionResponse {
  order: OrderInterface | null
}

export const addOrderProcedure = publicProcedure
  .input(addOrderRequestSchema)
  .mutation(async ({ input }): Promise<addOrderResponse> => {
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
              lastname: input.additional_info.user_data.lastname
          };
      } else {
        billingAddress = input.additional_info.billing_address;
        Object.assign(billingAddress, {billing_type: input.additional_info.entity_type});
      }

      const additionalInfo = {
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
        additional_info: additionalInfo,
        payment_method: input.payment_method,
        delivery_method: input.delivery_method,
        total_cost: input.total_cost,
        delivery_details: deliveryDetails
      });

      client.orders.push(order._id.toString());
      await client.save();

      // Send email
      const transporter = nodemailer.createTransport(mailConfig);

      const productsWithSale = input.products.map(item => ({
        ...item,
        product: {
          ...item.product,
          sale: item.product.sale || { active: false, sale_price: 0 }
        }
      }));

      const emailHtml = await render(OrderConfirmation({
        order: order.toObject() as ResOrderInterface,
        products: productsWithSale,
        locale: "ro",
        paymentMethodName: input.payment_method,
        regionName: input.additional_info.delivery_address?.region || "",
        baseUrl: process.env.BASE_URL,
      }));

      const data = {
          from: process.env.FROM_EMAIL_ADDRESS,
          to: input.additional_info.user_data.email,
          subject: subjectLang.get("ro"),
          html: emailHtml
      }

      await transporter.sendMail(data);

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