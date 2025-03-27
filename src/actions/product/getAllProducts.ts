// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { fromError } from 'zod-validation-error';
// import { Product } from '@/models/product/product';
// import connectMongo from '@/lib/connect-mongo';
// import { ProductInterface } from '@/models/product/types/productInterface';

// export interface getProductResponseInterface extends ActionResponse {
//     products: ProductInterface[] | null
// }

// export const getAllProducts = async (): Promise<getProductResponseInterface> => {    
//     try {
//         await connectMongo();
        
//         const products = await Product.find({});

//         if (!products) {
//             return {
//                 success: false,
//                 error: "Products not found",
//                 products: null
//             }
//         }

//         return {
//             success: true,
//             products: products
//         };
//     } catch (e: any) {
//         const validationError = fromError(e);

//         return {
//             success: false,
//             error: validationError.toString(),
//             products: null
//         }
//     }
// }