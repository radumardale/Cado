// 'use server'

// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import connectMongo from '@/lib/connect-mongo';
// import { ActionResponse } from '@/lib/types/ActionResponse';
// import { searchProductRequestSchema } from '@/lib/validation/search/searchProductRequest';
// import { z } from 'zod';
// import { fromError } from 'zod-validation-error';
// import { Product } from '@/models/product/product';


// type searchProductRequestProps = z.infer<typeof searchProductRequestSchema>

// type OptimizedProduct = {
//     id: string;
//     price: number;
//     images: string[];
//     title: {
//         ro: string;
//         ru: string;
//     };
//     sale: {
//         active: boolean;
//         sale_price: number;
//     };
// }

// export interface searchProductResponseInterface extends ActionResponse {
//     products: OptimizedProduct[] | [],
//     count: number
// }

// export const searchProduct = async (props: searchProductRequestProps): Promise<searchProductResponseInterface> => {
//     try {
//         searchProductRequestSchema.parse(props);
        
//         await connectMongo();
        
//         const products = await Product.find({
//           "title.ro": { $regex: props.title, $options: "i" }
//         })
//         .limit(5)
//         .select("id title images price sale");

//         if (!products) {
//             return {
//                 success: false,
//                 error: "This product does not exist",
//                 products: [],
//                 count: 0
//             }
//         }

//         return {
//             success: true,
//             products: products,
//             count: products.length
//         };
//     } catch (e: any) {
//         const validationError = fromError(e);

//         return {
//             success: false,
//             error: validationError.toString(),
//             products: [],
//             count: 0
//         }
//     }
// }