import SortBy from '@/lib/enums/SortBy';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProductsSearchState {
  search: string;
  setSearch: (value: string) => void;
  sortBy: SortBy;
  setSortBy: (value: SortBy) => void;
  gridLayout: boolean;
  setGridLayout: (value: boolean) => void;
}

export const useProductsSearchStore = create<ProductsSearchState>()(
  devtools(
    set => ({
      search: '',
      setSearch: value => set({ search: value }),
      sortBy: SortBy.LATEST,
      setSortBy: value => set({ sortBy: value }),
      gridLayout: false,
      setGridLayout: value => set({ gridLayout: value }),
    }),
    {
      name: 'products-search-storage',
    }
  )
);
