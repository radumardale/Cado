import { assert, test } from 'vitest'
import { appRouter } from "@/server";

test.skip("deleteAllProducts", async () => {
    const caller = appRouter.createCaller({});
    const productsRes = (await caller.products.getAllProducts());

    assert(productsRes.products != null, productsRes.error);


    for (const product of productsRes.products) {
        if (product.images.length < 4) {
            await caller.products.deleteProduct({
                id: product._id.toString(),
            })
        } 
    }

    // expectTypeOf(res).toEqualTypeOf<ActionResponse>();
})