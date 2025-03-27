import { z } from "zod"
import { uploadImageRequestSchema } from "@/lib/validation/image/uploadImageRequest"
import { updateProductImages } from "./updateProductImages";

type selectObjectToUpdateProps = z.infer<typeof uploadImageRequestSchema>

export const selectObjectToUpdate = async (props: selectObjectToUpdateProps) => {
    let res;
    switch(props.destination) {
        case "PRODUCT": res = await updateProductImages(props); break;
    }

    return res;
}