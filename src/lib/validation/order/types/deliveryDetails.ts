import { z } from 'zod';

export const DeliveryDetails = z.object({
  delivery_date: z.string().optional(),
  hours_intervals: z.string().optional(),
  message: z.string().optional(),
  comments: z.string().optional(),
});
