import { z } from "zod";
import { ClientEntity } from "@/models/order/types/orderEntity";
import { UserData } from "./userData";
import { OrderBillingAddress } from "./orderBillingAddress";

export const AdditionalInfoSchema = z.object({
    user_data: UserData,
    delivery_address: z.object({
        region: z.string().min(5, "Vă rugăm să completați spațiul liber").optional(),
        city: z.string().optional(),
        home_address: z.string().optional(),
        home_nr: z.string().optional(),
    }),
    billing_address: OrderBillingAddress,
    billing_checkbox: z.boolean(),
    entity_type: z.nativeEnum(ClientEntity)
})
.refine((data) => {
    if (!data.billing_checkbox) {
        if (!data.billing_address.city || data.billing_address.city.length < 2) return false;
    }

    return true;
},
{
    message: "Vă rugăm să completați spațiul liber",
    path: ["billing_address.city"]
})
.refine((data) => {
    if (!data.billing_checkbox) {
        if (!data.billing_address.home_address || data.billing_address.home_address.length < 2) return false;
    }

    return true;
},
{
    message: "Vă rugăm să completați spațiul liber",
    path: ["billing_address.home_address"]
});