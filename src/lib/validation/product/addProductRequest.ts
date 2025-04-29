import { z } from 'zod';
import { productInfoSchema } from './types/productInfo';
import { productSaleSchema } from './types/productSale';
import { Categories } from '@/lib/enums/Categories';
import { Ocasions } from '@/lib/enums/Ocasions';
import { ProductContent } from '@/lib/enums/ProductContent';
import { stockAvailabilitySchema } from './types/stockAvailability';

export const addProductRequestSchema = z.object({
    data: z.object({
        title: productInfoSchema,
        description: productInfoSchema,
        long_description: productInfoSchema,
        image_description: productInfoSchema,
        set_description: productInfoSchema.optional(),
        price: z.number().min(0, "Price cannot be below 0"),
        nr_of_items: z.number(),
        categories: z.array(z.nativeEnum(Categories)),
        ocasions: z.array(z.nativeEnum(Ocasions)),
        product_content: z.array(z.nativeEnum(ProductContent)),
        stock_availability: stockAvailabilitySchema,
        sale: productSaleSchema.optional(),
        images: z.array(z.string())
    })
});