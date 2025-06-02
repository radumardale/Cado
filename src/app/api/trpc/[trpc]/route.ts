/* eslint-disable  @typescript-eslint/no-explicit-any */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/server/trpc';
import { appRouter } from '@/server';

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req: req as any }),
    responseMeta(opts) {
      const { paths, errors, type } = opts;
      
      // Define which routes should be cached
      const publicCacheableRoutes = [
        'home_banner.getAllHomeBanners',
        'products.getRecProduct',
        'blog.getAllBlogs',
        // Add other read-only routes
      ];
      
      // Define which routes should have shorter cache for frequently updated data
      const shortCacheRoutes = [
        'order.getAllOrders',
        'products.getProducts'
      ];
      
      const allOk = errors.length === 0;
      const isQuery = type === 'query';
      
      if (allOk && isQuery && paths) {
        // Check if any path matches our cacheable routes
        const hasPublicRoute = paths.some(path => 
          publicCacheableRoutes.some(route => path.includes(route))
        );
        
        const hasShortCacheRoute = paths.some(path => 
          shortCacheRoutes.some(route => path.includes(route))
        );
        
        if (hasPublicRoute) {
          // Long cache for static-ish data (banners, products, blogs)
          const ONE_HOUR = 60 * 60;
          const ONE_DAY = 24 * ONE_HOUR;
          
          return {
            headers: new Headers([
              [
                'cache-control',
                `s-maxage=${ONE_HOUR}, stale-while-revalidate=${ONE_DAY}`,
              ],
              ['cdn-cache-control', 'max-age=31536000'], // 1 year for CDN
            ]),
          };
        }
        
        if (hasShortCacheRoute) {
          // Short cache for frequently updated data (orders)
          const THIRTY_SECONDS = 30;
          const FIVE_MINUTES = 5 * 60;
          
          return {
            headers: new Headers([
              [
                'cache-control',
                `s-maxage=${THIRTY_SECONDS}, stale-while-revalidate=${FIVE_MINUTES}`,
              ],
            ]),
          };
        }
      }
      
      // No cache for mutations or non-cacheable routes
      return {
        headers: new Headers([
          ['cache-control', 'no-store'],
        ]),
      };
    },
  });
};

export { handler as GET, handler as POST };