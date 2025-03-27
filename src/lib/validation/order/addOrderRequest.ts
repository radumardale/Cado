import { z } from 'zod';
import { AdditionalInfoSchema } from './types/additionalInfo';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';

const emailRegex = new RegExp("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}$");

export const addOrderRequestSchema = z.object({
    email: z.string().regex(emailRegex),
    products: z.array(z.string().length(24, "ID must be exactly 24 characters long")),
    additional_info: AdditionalInfoSchema,
    payment_method: z.nativeEnum(OrderPaymentMethod)
});