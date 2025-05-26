import { router } from './trpc';
import { productRouter } from './procedures/routers/productRouter';
import { imageRouter } from './procedures/routers/imageRouter';
import { orderRouter } from './procedures/routers/orderRouter';
import { searchProductProcedure } from './procedures/search/searchProduct';
import { blogRouter } from './procedures/routers/blogRouter';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { getAllClientsProcedure } from './procedures/clients/getAllClients';

export const appRouter = router({
  products: productRouter,
  image: imageRouter,
  order: orderRouter,
  blog: blogRouter,
  search: searchProductProcedure,
  getAllClients: getAllClientsProcedure
});

export type AppRouter = typeof appRouter;

export const serverHelper = createServerSideHelpers({
  router: appRouter,
  ctx: {},
  transformer: superjson
});