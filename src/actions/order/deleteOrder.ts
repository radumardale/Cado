// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { deleteOrderRequestSchema } from '@/lib/validation/order/deleteOrderRequest';
// import { fromError } from 'zod-validation-error';
// import connectMongo from '@/lib/connect-mongo';
// import { z } from 'zod';
// import { Order } from '@/models/order/order';

// type deleteOrderRequestProps = z.infer<typeof deleteOrderRequestSchema>;

// export const deleteOrder = async (props: deleteOrderRequestProps): Promise<ActionResponse> => {
//   try {
//     deleteOrderRequestSchema.parse(props);

//     await connectMongo();

//     await Order.findByIdAndDelete(props.id);

//     return {
//       success: true,
//     };
//   } catch (e: any) {
//     const validationError = fromError(e);

//     return {
//       success: false,
//       error: validationError.toString(),
//     };
//   }
// };