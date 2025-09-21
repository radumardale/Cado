/* eslint-disable  @typescript-eslint/no-explicit-any */

import { ActionResponse } from '@/lib/types/ActionResponse';
import { Blog } from '@/models/blog/blog';
import connectMongo from '@/lib/connect-mongo';

interface deleteBlogImageProps {
  id: string;
}

export const deleteBlogImage = async (props: deleteBlogImageProps): Promise<ActionResponse> => {
  try {
    await connectMongo();

    // Update the blog post to remove the image
    await Blog.updateOne({ _id: props.id }, { $set: { image: '' } });

    return {
      success: true,
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || 'Failed to delete blog image',
    };
  }
};
