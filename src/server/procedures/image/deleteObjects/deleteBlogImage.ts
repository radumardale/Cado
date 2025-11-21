
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
  } catch (error) {
    console.error('Error deleting blog image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete blog image',
    };
  }
};
