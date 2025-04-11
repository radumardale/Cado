import { BlogTags } from "@/lib/enums/BlogTags";
import { ProductInfo } from "@/models/product/types/productInfo";
import { SectionInterface } from "./SectionInterface";

export interface BlogInterface {
    _id: string,
    title: ProductInfo,
    image: string,
    tag: BlogTags,
    date: Date,
    reading_length: number,
    sections: SectionInterface[]
}