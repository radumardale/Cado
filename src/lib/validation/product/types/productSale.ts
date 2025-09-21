import { z } from 'zod';

export const productSaleSchema = z.object({
  active: z.boolean(),
  sale_price: z.number().min(0, 'Price cannot be below 0'),
});
