import { Categories } from '@/lib/enums/Categories';
import { Ocasions } from '@/lib/enums/Ocasions';
import { ProductContent } from '@/lib/enums/ProductContent';
import SortBy from '@/lib/enums/SortBy';
import { z } from 'zod';

export const getAllProductsRequestSchema = z.object({
    chunk: z.number().min(0),
    ocasions: z.array(z.nativeEnum(Ocasions)),
    categories: z.array(z.nativeEnum(Categories)),
    productContent: z.array(z.nativeEnum(ProductContent)),
    price: z.object({
        min: z.number(),
        max: z.number(),
    }),
    sortBy: z.nativeEnum(SortBy).default(SortBy.RECOMMENDED)
});