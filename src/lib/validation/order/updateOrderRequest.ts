import { z } from 'zod';
import { addOrderRequestSchema } from './addOrderRequest';
import { OrderState } from '@/models/order/types/orderState';

export const updateOrderRequestSchema = addOrderRequestSchema.extend({
    state: z.nativeEnum(OrderState),
    id: z.string().length(24, "ID must be exactly 24 characters long")
}) 