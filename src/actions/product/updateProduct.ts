// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import connectMongo from '@/lib/connect-mongo';
// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { updateProductRequestSchema } from '@/lib/validation/product/updateProductRequest';
// import { Product } from '@/models/product/product';
// import { ProductInterface } from '@/models/product/types/productInterface';
// import { z } from 'zod';
// import { fromError } from 'zod-validation-error';

// type updateProductRequestProps = z.infer<typeof updateProductRequestSchema>;

// export interface updateProductResponseInterface extends ActionResponse {
//     product: ProductInterface | null
// }

// export const updateProduct = async (props: updateProductRequestProps): Promise<updateProductResponseInterface> => {
//     try {
//         updateProductRequestSchema.parse(props);

//         await connectMongo();
        
//         const product = await Product.findByIdAndUpdate(props.id, props.data);

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