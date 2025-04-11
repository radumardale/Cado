import { z } from "zod";
import { OrderNormalAddress } from "./orderNormalAddress";
import { OrderLegalAddress } from "./orderLegalAddress";
import { ClientEntity } from "@/models/order/types/orderEntity";
import { OrderAddress } from "./orderAddress";
import { UserData } from "./userData";

export const AdditionalInfoSchema = z.object({
    user_data: UserData,
    delivery_address: OrderAddress.optional(),
    billing_address: OrderNormalAddress.or(OrderLegalAddress),
    enitity_type: z.nativeEnum(ClientEntity)
});