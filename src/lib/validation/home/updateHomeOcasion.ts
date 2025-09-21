import { Ocasions } from '@/lib/enums/Ocasions';
import { z } from 'zod';
import { productInfoSchema } from '../product/types/productInfo';

export const updateHomeOcasionRequestSchema = z.object({
  id: z.string().length(24, 'ID must be exactly 24 characters long'),
  ocasionTitle: productInfoSchema,
  ocasion: z.union([z.nativeEnum(Ocasions), z.literal('DISCOUNTS')]),
});
