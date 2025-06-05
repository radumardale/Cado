import { productRouter } from './procedures/routers/productRouter';
import { imageRouter } from './procedures/routers/imageRouter';
import { orderRouter } from './procedures/routers/orderRouter';
import { searchProductProcedure } from './procedures/search/searchProduct';
import { blogRouter } from './procedures/routers/blogRouter';
import { getAllClientsProcedure } from './procedures/clients/getAllClients';
import { homeRouter } from './procedures/routers/homeRouter';
import { homeOcasionRouter } from './procedures/routers/homeOcasionRouter';
import { router } from './trpc';
import { seasonCatalogRouter } from './procedures/routers/seasonCatalogRouter';

export const appRouter = router({
  products: productRouter,
  image: imageRouter,
  order: orderRouter,
  blog: blogRouter,
  search: searchProductProcedure,
  home_banner: homeRouter,
  homeOcasion: homeOcasionRouter,
  seasonCatalog: seasonCatalogRouter,
  getAllClients: getAllClientsProcedure
});

export type AppRouter = typeof appRouter;