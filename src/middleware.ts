import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', // The root path
    '/(ro|en)/:path*', // Locale-prefixed paths
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ]
};