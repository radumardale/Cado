import { updateProductImages } from "./updateProductImages"
import { z } from "zod"
import { uploadImageRequestSchema } from "@/lib/validation/image/uploadImageRequest"

type selectObjectToUpdateProps = z.infer<typeof uploadImageRequestSchema>

export const selectObjectToUpdate = async (props: selectObjectToUpdateProps) => {
    let res;
    switch(props.destination) {
        case "PRODUCT": res = await updateProductImages(props); break;
    }

    return res;
}