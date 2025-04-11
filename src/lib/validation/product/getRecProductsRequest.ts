import { Categories } from '@/lib/enums/Categories';
import { z } from 'zod';

export const getRecProductsRequestSchema = z.object({
    category: z.nativeEnum(Categories)
});