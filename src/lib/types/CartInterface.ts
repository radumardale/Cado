import { ProductInterface } from "@/models/product/types/productInterface"

export interface CartInterface {
    product: ProductInterface,
    quantity: number
}