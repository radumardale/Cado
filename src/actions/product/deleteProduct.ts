// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import connectMongo from '@/lib/connect-mongo';
// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { deleteProductRequestSchema } from '@/lib/validation/product/deleteProductRequest';
// import { Product } from '@/models/product/product';
// import { z } from 'zod';
// import { fromError } from 'zod-validation-error';

// type deleteProductRequestProps = z.infer<typeof deleteProductRequestSchema>

// export const deleteProduct = async (props: deleteProductRequestProps): Promise<ActionResponse> => {
//     try {
//         deleteProductRequestSchema.parse(props);

//         await connectMongo();
        
//         const product = await Product.findByIdAndDelete(props.id);

//         if (!product) {
//             return {
//                 success: false,
//                 error: "This product does not exist",
//             }
//         }

//         return {
//             success: true,
//         };
//     } catch (e: any) {
//         const validationError = fromError(e);

//         return {
//             success: false,
//             error: validationError.toString(),
//         }
//     }
// }