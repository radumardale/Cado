// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { getProductRequestSchema } from '@/lib/validation/product/getProductRequest';
// import { z } from 'zod';
// import { fromError } from 'zod-validation-error';
// import { Product } from '@/models/product/product';
// import connectMongo from '@/lib/connect-mongo';
// import { ProductInterface } from '@/models/product/types/productInterface';

// type getProductRequestProps = z.infer<typeof getProductRequestSchema>

// export interface getProductResponseInterface extends ActionResponse {
//     product: ProductInterface | null
// }

// export const getProduct = async (props: getProductRequestProps): Promise<getProductResponseInterface> => {    
//     try {
//         getProductRequestSchema.parse(props);

//         await connectMongo();
        
//         const product = await Product.findById(props.id);

//         if (!product) {
//             return {
//                 success: false,
//                 error: "This product does not exist",
//                 product: null
//             }
//         }

//         return {
//             success: true,
//             product: product
//         };
//     } catch (e: any) {
//         const validationError = fromError(e);

//         return {
//             success: false,
//             error: validationError.toString(),
//             product: null
//         }
//     }
// }