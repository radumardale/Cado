import { Archive, ShoppingBag, StickyNote, Users } from 'lucide-react';
import { ReactNode } from 'react';
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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

interface AdminPageState {
  page: AdminPages
  setPage: (value: AdminPages) => void,
}

export const useAdminPageStore = create<AdminPageState>()(
  devtools(
    persist(
      (set) => ({
        page: AdminPages.ORDERS,
        setPage: (value) => set({page: value}),
      }),
      {
        name: "cart-storage"
      }
    ),
  ),
)

export const AdminPagesIcons: Record<AdminPages, ReactNode> = {
    [AdminPages.ORDERS]: <ShoppingBag strokeWidth={1.5} className="text-white size-6" />,
    [AdminPages.PRODUCTS]: <Archive strokeWidth={1.5} className="text-white size-6" />,
    [AdminPages.CLIENTS]: <Users strokeWidth={1.5} className="text-white size-6" />,
    [AdminPages.HOME_PAGE]: <StickyNote strokeWidth={1.5} className="text-white size-6" />,
    [AdminPages.BLOG_PAGE]: <Archive strokeWidth={1.5} className="text-white size-6" />,
    [AdminPages.SEASON_CATALOG]: <Archive strokeWidth={1.5} className="text-white size-6" />,
    [AdminPages.CONTACT_DETAILS]: <Archive strokeWidth={1.5} className="text-white size-6" />,
};