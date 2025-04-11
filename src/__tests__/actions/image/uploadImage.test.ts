import { assert, test } from 'vitest'
// import { imageUploadResponseInterface, uploadImage } from '@/actions/image/uploadImage';
import { appRouter } from '@/server';
import { image } from './testImage';

test.skip("uploadImage", async () => {
    const caller = appRouter.createCaller({});
    const blogsRes = (await caller.blog.getLimitedBlogs({limit: 10}));

    assert(blogsRes.blogs != null, blogsRes.error);


    for (const blog of blogsRes.blogs) {
        await caller.image.updateImage({
            id: blog._id.toString(),
            destination: 'BLOG',
            image: image
        })
    }


    // expectTypeOf(res).toEqualTypeOf<imageUploadResponseInterface>();
})