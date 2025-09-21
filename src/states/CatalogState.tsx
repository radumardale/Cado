import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CatalogState {
  minPrice: number;
  setMinPrice: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
}

export const useCatalogStore = create<CatalogState>()(
  devtools(
    set => ({
      minPrice: 0,
      setMinPrice: value => set({ minPrice: value }),
      maxPrice: 0,
      setMaxPrice: value => set({ maxPrice: value }),
    }),
    {
      name: 'catalog-storage',
    }
  )
);
