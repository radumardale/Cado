import { Categories } from "@/lib/enums/Categories";
import { ProductInfo } from "./productInfo";
import { ProductSale } from "./productSale";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";

export interface ProductInterface {
    title: ProductInfo,
    description: ProductInfo,
    set_description: ProductInfo,
    price: number,
    categories: Categories[],
    ocasions: Ocasions[],
    product_content: ProductContent[],
    stock_availability: number,
    images: string[],
    sale: ProductSale
}