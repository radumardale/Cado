import SortBy from '@/lib/enums/SortBy'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ClientSearchState {
  search: string
  setSearch: (value: string) => void,
  sortBy: SortBy,
  setSortBy: (value: SortBy) => void,
}

export const useClientSearchStore = create<ClientSearchState>()(
  devtools(
      (set) => ({
        search: '',
        setSearch: (value) => set({search: value}),
        sortBy: SortBy.LATEST,
        setSortBy: (value) => set({sortBy: value}),
      }),
      {
        name: "clients-search-storage"
      }
  ),
)