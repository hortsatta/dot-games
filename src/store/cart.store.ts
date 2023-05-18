import type { StateCreator } from 'zustand';
import type { CartItem } from '#/types/cart.type';
import type { CoreSlice } from './core.store';

type CartStoreState = {
  cartItems: CartItem[];
  // clientSecret?: string | null;
};

export type CartSlice = {
  cart?: CartStoreState;
  cartItems: () => CartItem[] | null;
  setCart: (cart?: CartStoreState) => void;
};

export const createCartSlice: StateCreator<
  CoreSlice & CartSlice,
  [],
  [],
  CartSlice
> = (set, get) => ({
  cart: undefined,
  cartItems: () => get().cart?.cartItems || null,
  setCart: (cart?: CartStoreState) => set({ cart }),
});
