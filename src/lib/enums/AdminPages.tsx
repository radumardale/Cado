import { Pathnames } from '@/i18n/routing';
import { Archive, Mail, ShoppingBag, StickyNote, Users } from 'lucide-react';
import { ReactNode } from 'react';

export enum AdminPages {
    ORDERS = "ORDERS",
    PRODUCTS = "PRODUCTS",
    CLIENTS = "CLIENTS",
    HOME_PAGE = "HOME_PAGE",
    BLOG_PAGE = "BLOG_PAGE",
    SEASON_CATALOG = "SEASON_CATALOG",
    CONTACT_DETAILS = "CONTACT_DETAILS",
}

export const AdminPagesArr = Object.values(AdminPages).filter(value => typeof value === 'string') as string[];

export const AdminPagesIcons: Record<AdminPages, ReactNode> = {
    [AdminPages.ORDERS]: <ShoppingBag strokeWidth={1.5} className="size-6 transition duration-300" />,
    [AdminPages.PRODUCTS]: <Archive strokeWidth={1.5} className="size-6 transition duration-300" />,
    [AdminPages.CLIENTS]: <Users strokeWidth={1.5} className="size-6 transition duration-300" />,
    [AdminPages.HOME_PAGE]: <StickyNote strokeWidth={1.5} className="size-6 transition duration-300" />,
    [AdminPages.BLOG_PAGE]: <StickyNote strokeWidth={1.5} className="size-6 transition duration-300" />,
    [AdminPages.SEASON_CATALOG]: <StickyNote strokeWidth={1.5} className="size-6 transition duration-300" />,
    [AdminPages.CONTACT_DETAILS]: <Mail strokeWidth={1.5} className="size-6 transition duration-300" />,
};

export const AdminPagesLinks: Record<AdminPages, Pathnames> = {
  [AdminPages.ORDERS]: '/admin/orders',
  [AdminPages.PRODUCTS]: '/admin/products',
  [AdminPages.CLIENTS]: '/admin/clients',
  [AdminPages.HOME_PAGE]: '/admin/home-page',
  [AdminPages.BLOG_PAGE]: '/admin/blog-page',
  [AdminPages.SEASON_CATALOG]: '/admin/catalog-sezon',
  [AdminPages.CONTACT_DETAILS]: '/admin/contact-details',
};