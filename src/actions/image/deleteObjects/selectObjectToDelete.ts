// import { deleteImageRequestSchema } from "@/lib/validation/image/deleteImageRequest";
// import { deleteProductImages } from "./deleteProductImages"
// import { z } from "zod"

// type selectObjectToDeleteProps = z.infer<typeof deleteImageRequestSchema>

// export const selectObjectToDelete = async (props: selectObjectToDeleteProps) => {
//     let res;
//     switch(props.destination) {
//         case "PRODUCT": res = await deleteProductImages(props); break;
//     }

//     return res;
// }