import { deleteImageRequestSchema } from "@/lib/validation/image/deleteImageRequest";
import { z } from "zod"
import { deleteProductImages } from "./deleteProductImages";
import { deleteBlogImage } from "./deleteBlogImage";

type selectObjectToDeleteProps = z.infer<typeof deleteImageRequestSchema>

export const selectObjectToDelete = async (props: selectObjectToDeleteProps) => {
    let res;
    switch(props.destination) {
        case "PRODUCT": res = await deleteProductImages(props); break;
        case "BLOG": res = await deleteBlogImage(props); break;
    }

    return res;
}