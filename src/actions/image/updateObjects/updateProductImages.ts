import connectMongo from "@/lib/connect-mongo";
import { Product } from "@/models/product/product";
import { ProductInterface } from "@/models/product/types/productInterface";

interface updateProductImagesProps {
    id: string,
    image: string
}

interface updateProductResponseInterface {
    product: ProductInterface
}

export const updateProductImages = async (props: updateProductImagesProps): Promise<updateProductResponseInterface> => {
    await connectMongo();

    const product = await Product.findByIdAndUpdate(props.id, { $push: { images: props.image } }, {new: true});

    return product;
}