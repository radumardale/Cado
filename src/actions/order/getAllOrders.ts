// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { fromError } from 'zod-validation-error';
// import connectMongo from '@/lib/connect-mongo';
// import { OrderInterface } from '@/models/order/types/orderInterface';
// import { Order } from '@/models/order/order';
// import { ProductInterface } from '@/models/product/types/productInterface';
// import { ClientInterface } from '@/models/client/types/clientInterface';
// import { Product } from '@/models/product/product';
// import { Client } from '@/models/client/client';

// export interface getAllOrdersResponseInterface extends ActionResponse {
//     orders: OrderInterface[]
// }

// export const getAllOrders = async (): Promise<getAllOrdersResponseInterface> => {    
//     try {

//         await connectMongo();
        
//         const orders = await Order.find({})
//             .populate<{ products: ProductInterface[] }>("products", "", Product)
//             .populate<{ client: ClientInterface }>("client", "email", Client);

//         if (!orders) {
//             return {
//                 success: false,
//                 error: "This product does not exist",
//                 orders: []
//             }
//         }

//         return {
//             success: true,
//             orders: orders
//         };
        

//     return {
//         success: false,
//         error: 'internal testing',
//         orders: []
//     }
//     } catch (e: any) {
//         const validationError = fromError(e);

//         return {
//             success: false,
//             error: validationError.toString(),
//             orders: []
//         }
//     }
// }