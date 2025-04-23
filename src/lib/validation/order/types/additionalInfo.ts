import { z } from "zod";
import { OrderNormalAddress } from "./orderNormalAddress";
import { OrderLegalAddress } from "./orderLegalAddress";
import { ClientEntity } from "@/models/order/types/orderEntity";
import { UserData } from "./userData";

export const AdditionalInfoSchema = z.object({
    user_data: UserData,
    delivery_address: z.object({
        region: z.string({ required_error: "Vă rugăm să completați spațiul liber" }).min(5, "Vă rugăm să completați spațiul liber").optional(),
        city: z.string({ required_error: "Vă rugăm să completați spațiul liber" }).optional(),
        home_address: z.string({ required_error: "Vă rugăm să completați spațiul liber" }).optional(),
        home_nr: z.string().optional(),
    }),
    billing_address: z.union([OrderNormalAddress, OrderLegalAddress, z.undefined()]),
    entity_type: z.nativeEnum(ClientEntity)
});