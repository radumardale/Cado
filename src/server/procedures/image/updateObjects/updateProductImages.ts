import { Product } from "@/models/product/product";
import { ProductInterface } from "@/models/product/types/productInterface";
import { deleteFromBucket } from "../deleteObjects/deleteFromBucket";

interface updateProductImagesProps {
    id: string,
    filenames: string[]
}

interface updateProductResponseInterface {
    product: ProductInterface
}

export const updateProductImages = async (props: updateProductImagesProps): Promise<updateProductResponseInterface> => {
    const product = await Product.findById(props.id);
    
    for (const image of product.images) {
      if (!props.filenames.includes(image)) {
        await deleteFromBucket(image);
      }
    }

    product.images = props.filenames;
    await product.save();

    return product;
}