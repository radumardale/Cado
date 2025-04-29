import { StockState } from '@/lib/enums/StockState';
import { z } from 'zod';

export const stockAvailabilitySchema = z.object({
    stock: z.number(),
    state: z.nativeEnum(StockState)
});