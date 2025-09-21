import SortBy from '@/lib/enums/SortBy';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OrdersSearchState {
  search: string;
  setSearch: (value: string) => void;
  sortBy: SortBy;
  setSortBy: (value: SortBy) => void;
  startDate: Date | undefined;
  setStartDate: (value: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (value: Date | undefined) => void;
}

export const useOrdersSearchStore = create<OrdersSearchState>()(
  devtools(
    set => ({
      search: '',
      setSearch: value => set({ search: value }),
      sortBy: SortBy.LATEST,
      setSortBy: value => set({ sortBy: value }),
      startDate: undefined,
      setStartDate: value => set({ startDate: value }),
      endDate: undefined,
      setEndDate: value => set({ endDate: value }),
    }),
    {
      name: 'orders-search-storage',
    }
  )
);
