/* eslint-disable  @typescript-eslint/no-explicit-any */

import { ActionResponse } from '@/lib/types/ActionResponse';
import { Product } from '@/models/product/product';

interface deleteProductImagesProps {
  id: string;
  image: string;
}

export const deleteProductImages = async (
  props: deleteProductImagesProps
): Promise<ActionResponse> => {
  try {
    await Product.updateOne(
      { _id: props.id },
      {
        $pull: {
          images: props.image,
        },
      }
    );

    return {
      success: true,
    };
  } catch (e: any) {
    return {
      success: true,
      error: e,
    };
  }
};
