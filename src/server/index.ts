import { router } from './trpc';
import { productRouter } from './procedures/routers/productRouter';
import { imageRouter } from './procedures/routers/imageRouter';
import { orderRouter } from './procedures/routers/orderRouter';
import { searchProductProcedure } from './procedures/search/searchProduct';


export const appRouter = router({
  products: productRouter,
  image: imageRouter,
  order: orderRouter,
  search: searchProductProcedure
});

export type AppRouter = typeof appRouter;