import type { StateCreator } from 'zustand';
import type { CoreSlice } from './core.store';
import type { CartItem } from '#/types/cart.type';
import type { WishListSlice } from './wish-list.store';

type CartStoreState = {
  cartItems: CartItem[];
  // clientSecret?: string | null;
};

export type CartSlice = {
  cart?: CartStoreState;
  setCart: (cart?: CartStoreState) => void;
};

export const createCartSlice: StateCreator<
  CoreSlice & CartSlice & WishListSlice,
  [],
  [],
  CartSlice
> = (set) => ({
  cart: undefined,
  setCart: (cart?: CartStoreState) => set({ cart }),
});
