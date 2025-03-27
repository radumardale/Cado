import { z } from "zod";
import { OrderNormalAddress } from "./orderNormalAddress";
import { OrderLegalAddress } from "./orderLegalAddress";
import { ClientEntity } from "@/models/order/types/orderEntity";

export const AdditionalInfoSchema = z.object({
    delivery_address: OrderNormalAddress.optional(),
    billing_address: OrderNormalAddress.or(OrderLegalAddress),
    enitity_type: z.nativeEnum(ClientEntity)
});