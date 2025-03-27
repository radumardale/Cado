// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import { Product } from '@/models/product/product';
// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { addOrderRequestSchema } from '@/lib/validation/order/addOrderRequest';
// import { fromError } from 'zod-validation-error';
// import connectMongo from '@/lib/connect-mongo';
// import { z } from 'zod';
// import { Client } from '@/models/client/client';
// import { Order } from '@/models/order/order';
// import { OrderInterface } from '@/models/order/types/orderInterface';

// type addOrderRequestProps = z.infer<typeof addOrderRequestSchema>;

// export interface addOrderResponse extends ActionResponse {
//   order: OrderInterface | null
// }

// export const addOrder = async (props: addOrderRequestProps): Promise<addOrderResponse> => {
//   try {
//     addOrderRequestSchema.parse(props);

//     await connectMongo();

//     const client = await Client.findOneAndUpdate({email: props.email}, {}, {upsert: true});

//     if (!client) {
//       return {
//         success: false,
//         error: "Client not found",
//         order: null
//       };
//     }

//     const order = await Order.create({
//         products: props.products,
//         client: client._id,
//         additional_info: props.additional_info,
//         payment_method: props.payment_method
//     })

//     client.orders.push(order._id.toString());
//     await client.save();

//     return {
//       success: true,
//       order: order
//     };
//   } catch (e: any) {
//     const validationError = fromError(e);

//     return {
//       success: false,
//       error: validationError.toString(),
//       order: null
//     };
//   }
// };