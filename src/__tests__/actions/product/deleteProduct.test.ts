
import { expectTypeOf, test } from 'vitest'
import { appRouter } from '@/server';
import { assert } from 'console';
import { ActionResponse } from '@/lib/types/ActionResponse';

test.skip("deleteProduct", async () => {
    const caller = appRouter.createCaller({});

    const res = await caller.products.deleteProduct({
        id: "67e599e58287613b90c6ea5d",
    });

    assert(res.success === true, res.error);
    expectTypeOf(res).toEqualTypeOf<ActionResponse>();

})