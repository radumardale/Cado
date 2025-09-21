import { z } from 'zod';
import { productInfoSchema } from '../../product/types/productInfo';

export const sectionSchema = z.object({
  subtitle: productInfoSchema,
  content: productInfoSchema,
});
