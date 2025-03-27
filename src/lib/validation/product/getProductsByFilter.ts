import { Categories } from '@/lib/enums/Categories';
import { Ocasions } from '@/lib/enums/Ocasions';
import { ProductContent } from '@/lib/enums/ProductContent';
import { z } from 'zod';

export const getProductRequestSchema = z.object({
    ocasion: z.array(z.nativeEnum(Ocasions)),
    categories: z.array(z.nativeEnum(Categories)),
    ProductContent: z.array(z.nativeEnum(ProductContent)),
});