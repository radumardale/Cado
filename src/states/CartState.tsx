import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CartState {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      set => ({
        isOpen: false,
        setOpen: value => set({ isOpen: value }),
      }),
      {
        name: 'cart-storage',
      }
    )
  )
);
