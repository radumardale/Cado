import { z } from 'zod';
import { AdditionalInfoSchema } from './types/additionalInfo';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import { DeliveryDetails } from './types/deliveryDetails';

export const addOrderRequestSchema = z.object({
    products: z.array(z.string().length(24, "ID must be exactly 24 characters long")),
    additional_info: AdditionalInfoSchema,
    payment_method: z.nativeEnum(OrderPaymentMethod),
    delivery_method: z.nativeEnum(DeliveryMethod),
    delivery_details: DeliveryDetails,
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "Trebuie să acceptați termenii și condițiile"
    })
})
.refine((data) => {
    if (data.delivery_method === DeliveryMethod.HOME_DELIVERY) {
        return data.payment_method === OrderPaymentMethod.Paynet;
    }

    return true;
},
{
    message: "Pentru livrare la domiciliu, singura metodă de plată acceptată este PAYNET",
    path: ["payment_method"]
})
.refine((data) => {
    if (data.delivery_method === DeliveryMethod.HOME_DELIVERY) {
        if (data.additional_info.delivery_address.city === undefined) return false;
        if (data.additional_info.delivery_address.city.length < 2) return false;
    }

    return true;
},
{
    message: "Vă rugăm să completați spațiul liber",
    path: ["additional_info.delivery_address.city"]
})
.refine((data) => {
    if (data.delivery_method === DeliveryMethod.HOME_DELIVERY) {
        if (data.additional_info.delivery_address.home_address === undefined) return false;
        if (data.additional_info.delivery_address.home_address.length < 2) return false;
    }

    return true;
},
{
    message: "Vă rugăm să completați spațiul liber",
    path: ["additional_info.delivery_address.home_address"]
})