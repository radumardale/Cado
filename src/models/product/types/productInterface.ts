import { Categories } from "@/lib/enums/Categories";
import { ProductInfo } from "./productInfo";
import { ProductSale } from "./productSale";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";
import { StockAvailability } from "./stockAvailability";
import { Schema } from "mongoose";

export interface ProductInterface {
    _id: string,
    custom_id: string,
    title: ProductInfo,
    normalized_title: ProductInfo,
    description: ProductInfo,
    long_description: ProductInfo,
    set_description: ProductInfo,
    image_description: ProductInfo,
    price: number,
    nr_of_items: number,
    categories: Categories[],
    ocasions: Ocasions[],
    product_content: ProductContent[],
    stock_availability: StockAvailability,
    images: string[],
    sale: ProductSale,
    relevance: number,
}

export interface OrderProductInterface {
    _id: string,
    custom_id: string,
    title: ProductInfo,
    price: number,
    stock_availability: StockAvailability,
    sale: ProductSale,
    images: string[],
}

export const OrderProductsSchema = new Schema<OrderProductInterface>({
    _id: { type: String, required: true },
    custom_id: { type: String, required: true },
    title: { type: Object, required: true },
    price: { type: Number, required: true },
    stock_availability: { type: Object, required: true },
    sale: { type: Object, required: true },
    images: { type: [String] }
}, { _id: false });