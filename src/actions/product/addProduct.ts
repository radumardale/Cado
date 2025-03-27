// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import { Product } from '@/models/product/product';
// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { addProductRequestSchema } from '@/lib/validation/product/addProductRequest';
// import { fromError } from 'zod-validation-error';
// import connectMongo from '@/lib/connect-mongo';
// import { z } from 'zod';
// import { ProductInterface } from '@/models/product/types/productInterface';

// type addProductRequestProps = z.infer<typeof addProductRequestSchema>;

// export interface addProductResponseInterface extends ActionResponse {
//   product: ProductInterface | null;
// }

// export const addProduct = async (props: addProductRequestProps): Promise<addProductResponseInterface> => {
//   try {
//     addProductRequestSchema.parse(props);

//     await connectMongo();
    
//     const product = await Product.create(props.data);

//     return {
//       success: true,
//       product: product,
//     };
//   } catch (e: any) {
//     const validationError = fromError(e);

//     return {
//       success: false,
//       error: validationError.toString(),
//       product: null,
//     };
//   }
// };