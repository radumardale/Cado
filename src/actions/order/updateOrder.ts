// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { updateOrderRequestSchema } from '@/lib/validation/order/updateOrderRequest';
// import { fromError } from 'zod-validation-error';
// import connectMongo from '@/lib/connect-mongo';
// import { z } from 'zod';
// import { Order } from '@/models/order/order';
// import { OrderInterface } from '@/models/order/types/orderInterface';
// import { Client } from '@/models/client/client';

// type updateOrderRequestProps = z.infer<typeof updateOrderRequestSchema>;

// export interface updateOrderResponse extends ActionResponse {
//   order: OrderInterface | null
// }

// export const updateOrder = async (props: updateOrderRequestProps): Promise<updateOrderResponse> => {
//   try {
//     updateOrderRequestSchema.parse(props);

//     await connectMongo();

//     const client = await Client.findOneAndUpdate({email: props.email}, {}, {upsert: true});

//     const newOrderObject = {
//         additional_info: props.additional_info,
//         client: client?._id.toString(),
//         payment_method: props.payment_method,
//         products: props.products,
//         state: props.state
//     }

//     const order = await Order.findByIdAndUpdate(props.id, newOrderObject);

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