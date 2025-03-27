import { ProductInterface } from "@/models/product/types/productInterface";
import { AdditionalInfoInterface } from "./additionalInfo";
import { OrderPaymentMethod } from "./orderPaymentMethod";
import { OrderState } from "./orderState";
import { Types } from "mongoose";
import { ClientInterface } from "@/models/client/types/clientInterface";

export interface OrderInterface {
    products: Types.ObjectId[] | ProductInterface[],
    client: Types.ObjectId | ClientInterface,
    additional_info: AdditionalInfoInterface,
    state: OrderState,
    payment_method: OrderPaymentMethod
}

export interface ResOrderInterface {
    _id: string,
    products: Types.ObjectId[] | ProductInterface[],
    client: Types.ObjectId | ClientInterface,
    additional_info: AdditionalInfoInterface,
    state: OrderState,
    payment_method: OrderPaymentMethod
}