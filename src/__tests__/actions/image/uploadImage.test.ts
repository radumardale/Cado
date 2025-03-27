import { assert, test } from 'vitest'
// import { imageUploadResponseInterface, uploadImage } from '@/actions/image/uploadImage';
import { image2 } from './testImage2'
import { appRouter } from '@/server';
import { image } from './testImage';

test.skip("uploadImage", async () => {
    const caller = appRouter.createCaller({});
    const productsRes = (await caller.products.getAllProducts());

    assert(productsRes.products != null, productsRes.error);


    for (const product of productsRes.products) {
        await caller.image.updateImage({
            id: product._id.toString(),
            destination: 'PRODUCT',
            image: image
        })

        await caller.image.updateImage({
            id: product._id.toString(),
            destination: 'PRODUCT',
            image: image2
        })
    }


    // expectTypeOf(res).toEqualTypeOf<imageUploadResponseInterface>();
})