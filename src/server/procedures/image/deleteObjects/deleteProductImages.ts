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
  } catch (error) {
    console.error('Error deleting product images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete product images',
    };
  }
};
