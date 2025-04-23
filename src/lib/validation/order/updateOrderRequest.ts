import { z } from 'zod';
import { OrderState } from '@/models/order/types/orderState';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import { DeliveryDetails } from './types/deliveryDetails';
import { AdditionalInfoSchema } from './types/additionalInfo';

export const updateOrderRequestSchema = z.object({
    products: z.array(z.string().length(24, "ID must be exactly 24 characters long")),
    additional_info: AdditionalInfoSchema,
    payment_method: z.nativeEnum(OrderPaymentMethod),
    delivery_method: z.nativeEnum(DeliveryMethod),
    delivery_details: DeliveryDetails,
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "Trebuie să acceptați termenii și condițiile"
    }),
    state: z.nativeEnum(OrderState),
    id: z.string().length(24, "ID must be exactly 24 characters long")
}) 