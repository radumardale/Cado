import { AdditionalInfoInterface, ResAdditionalInfoInterface } from "./additionalInfo";
import { OrderPaymentMethod } from "./orderPaymentMethod";
import { OrderState } from "./orderState";
import { Types } from "mongoose";
import { ClientInterface } from "@/models/client/types/clientInterface";
import { DeliveryMethod } from "./deliveryMethod";
import { DeliveryDetailsInterface } from "./deliveryDetails";
import { CartProducts } from "./cartProducts";

export interface OrderInterface {
    products: CartProducts[],
    client: Types.ObjectId | ClientInterface,
    additional_info: AdditionalInfoInterface,
    state: OrderState,
    payment_method: OrderPaymentMethod,
    delivery_method: DeliveryMethod,
    custom_id: string,
    createdAt: Date,
    total_cost: number,
    delivery_details: DeliveryDetailsInterface
}

export interface ResOrderInterface {
    _id: string,
    products: CartProducts[],
    client: ClientInterface,
    additional_info: ResAdditionalInfoInterface,
    state: OrderState,
    payment_method: OrderPaymentMethod,
    delivery_method: DeliveryMethod,
    custom_id: string,
    createdAt: Date,
    total_cost: number,
    delivery_details: DeliveryDetailsInterface
}