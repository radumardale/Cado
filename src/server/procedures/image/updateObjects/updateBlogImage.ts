import { Blog } from "@/models/blog/blog";
import connectMongo from "@/lib/connect-mongo";
import { BlogInterface } from "@/models/blog/types/BlogInterface";

interface updateBlogImageProps {
    id: string,
    filenames: string[]
}

interface updateBlogResponseInterface {
    blog: BlogInterface
}

export const updateBlogImage = async (props: updateBlogImageProps): Promise<updateBlogResponseInterface> => {
    await connectMongo();

    const blog = await Blog.findByIdAndUpdate(
        props.id, 
        { image: props.filenames }, 
        { new: true, upsert: true }
    );

    return {
        blog: blog
    };
}