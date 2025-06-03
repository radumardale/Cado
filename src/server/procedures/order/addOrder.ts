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
import { APIClient } from "@/lib/apiCLient";
import { OrderPaymentMethod } from "@/models/order/types/orderPaymentMethod";

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
  ["en", "ORDER CONFIRMATION | CADO"],
  ["ro", "CONFIRMARE COMANDA | CADO"],
  ["fr", "CONFIRMATION DE COMMANDE | CADO"],
  ["ru", "ПОДТВЕРЖДЕНИЕ ЗАКАЗА | CADO"]
])

export interface addOrderResponse extends ActionResponse {
  paymentForm?: {
    action: string;
    method: string;
    fields: {
      operation: string;
      LinkUrlSucces: string;
      LinkUrlCancel: string;
      ExpiryDate: string;
      Signature: string;
      Lang: string;
    };
  },
  order?: OrderInterface
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

      if (input.payment_method === OrderPaymentMethod.Paynet) {
        const requestBody = {
          Invoice: order.invoice_id,
          MerchantCode: process.env.API_MERCHANT_CODE,
          LinkUrlSuccess: `${process.env.BASE_URL}/confirmation/${order.custom_id}`,
          LinkUrlCancel: `${process.env.BASE_URL}/confirmation/${order.custom_id}`,
          Signature: null,
          SignVersion: "v01",
          Customer: {
            Code: input.additional_info.user_data.email,
            Name: input.additional_info.user_data.firstname,
            NameFirst: input.additional_info.user_data.firstname,
            NameLast: input.additional_info.user_data.lastname,
            email: input.additional_info.user_data.email,
            Country: "Moldova",
            City: input.additional_info.delivery_address?.city || input.additional_info.billing_address?.city || "Chisinau",
            Address: `${input.additional_info.delivery_address?.home_address || input.additional_info.billing_address?.home_address || ""} ${input.additional_info.delivery_address?.home_nr || input.additional_info.billing_address?.home_nr || ""}`.trim(),
            PhoneNumber: input.additional_info.user_data.tel_number
          },
          Payer: null,
          Currency: 498,
          ExternalDate: new Date().toLocaleString("sv-SE", { timeZone: "Europe/Chisinau" }).replace(" ", "T") + "Z",
          ExpiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString("sv-SE", { timeZone: "Europe/Chisinau" }).replace(" ", "T") + "Z",
          Services: [
            {
              Name: "CADO Order",
              Description: `Order #${order.custom_id}`,
              Amount: Math.round(input.total_cost * 100), // Convert to cents
              Products: input.products.map((product: any, index: number) => ({
                GroupName: null,
                QualitiesConcat: null,
                LineNo: index + 1,
                GroupId: null,
                Code: product.code || `product_${index + 1}`,
                Barcode: product.barcode || index + 1001,
                Name: product.name,
                Description: product.description || product.name,
                UnitPrice: Math.round(product.price * 100), // Convert to cents
                UnitProduct: null,
                Quantity: product.quantity,
                Amount: null,
                Dimensions: null,
                Qualities: null,
                TotalAmount: Math.round(product.price * product.quantity * 100) // Convert to cents
              }))
            }
          ],
          MoneyType: null
        };
  
        const response = await APIClient.makeAuthenticatedRequest(
          `${process.env.API_BASE_URL}/api/Payments/Send`,
          {
            method: 'POST',
            body: JSON.stringify(requestBody)
          }
        );
        const data = await response.json();
  
        return {
          success: true,
          paymentForm: {
            action: process.env.API_REDIRECT_URL || '',
            method: 'POST',
            fields: {
              operation: data.PaymentId,
              LinkUrlSucces: `${process.env.BASE_URL}/confirmation/${order.custom_id}`,
              LinkUrlCancel: `${process.env.BASE_URL}/confirmation/${order.custom_id}`,
              ExpiryDate: data.ExpiryDate,
              Signature: data.Signature,
              Lang: 'ro'
            }
          }
        };
      }

      // Send email
      const transporter = nodemailer.createTransport(mailConfig);

      const emailHtml = await render(OrderConfirmation({
        order: { 
          ...order.toObject(), 
          _id: order._id.toString(),
          additional_info: order.additional_info,
        } as unknown as ResOrderInterface,
        locale: "ro",
        paymentMethodName: input.payment_method,
        regionName: input.additional_info.delivery_address?.region || "",
        baseUrl: process.env.BASE_URL,
      }));

      const emailData = {
          from: process.env.FROM_EMAIL_ADDRESS,
          to: input.additional_info.user_data.email,
          subject: subjectLang.get("ro"),
          html: emailHtml
      }

      await transporter.sendMail(emailData);

      return {
        success: true,
        order: order
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create order",
      };
    }
  });