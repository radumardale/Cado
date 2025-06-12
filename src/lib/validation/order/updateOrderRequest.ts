import { z } from 'zod';
import { AdditionalInfoSchema } from './types/additionalInfo';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import { DeliveryDetails } from './types/deliveryDetails';
import { ClientEntity } from '@/models/order/types/orderEntity';
import { productInfoSchema } from '../product/types/productInfo';
import { stockAvailabilitySchema } from '../product/types/stockAvailability';
import { productSaleSchema } from '../product/types/productSale';
import { OrderState } from '@/models/order/types/orderState';


export const updateOrderRequestSchema = z.object({
    id: z.string().length(24, "ID must be exactly 24 characters long"),
    products: z.array(
        z.object({
            product: z.object({
                _id: z.string().length(24, "ID must be exactly 24 characters long"),
                custom_id: z.string(),
                title: productInfoSchema,
                price: z.number().min(0, "Price cannot be below 0"),
                stock_availability: stockAvailabilitySchema,
                sale: productSaleSchema.optional(),
                images: z.array(z.string())
            }),
            quantity: z.number()
        })
    ),
    additional_info: AdditionalInfoSchema,
    payment_method: z.nativeEnum(OrderPaymentMethod),
    delivery_method: z.nativeEnum(DeliveryMethod),
    delivery_details: DeliveryDetails,
    total_cost: z.number(),
    state: z.nativeEnum(OrderState)
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
//Client entity refine
.refine((data) => {
    if (!data.additional_info.billing_checkbox && data.additional_info.entity_type === ClientEntity.Legal) {
        if (!data.additional_info.billing_address.company_name || data.additional_info.billing_address.company_name.length < 2) return false;
    }

    return true;
},
{
    message: "Vă rugăm să completați spațiul liber",
    path: ["additional_info.billing_address.company_name"]
})
.refine((data) => {
    if (!data.additional_info.billing_checkbox && data.additional_info.entity_type === ClientEntity.Legal) {
        if (!data.additional_info.billing_address.idno || data.additional_info.billing_address.idno.length < 2) return false;
    }

    return true;
},
{
    message: "Vă rugăm să completați spațiul liber",
    path: ["additional_info.billing_address.idno"]
})
.refine((data) => {
    if (!data.additional_info.billing_checkbox && data.additional_info.entity_type === ClientEntity.Natural) {
        if (!data.additional_info.billing_address.firstname || data.additional_info.billing_address.firstname.length < 2) return false;
    }

    return true;
},
{
    message: "Vă rugăm să completați spațiul liber",
    path: ["additional_info.billing_address.firstname"]
})
.refine((data) => {
    if (!data.additional_info.billing_checkbox && data.additional_info.entity_type === ClientEntity.Natural) {
        if (!data.additional_info.billing_address.lastname || data.additional_info.billing_address.lastname.length < 2) return false;
    }

    return true;
},
{
    message: "Vă rugăm să completați spațiul liber",
    path: ["additional_info.billing_address.lastname"]
})

export type UpdateOrderValues = z.infer<typeof updateOrderRequestSchema>;