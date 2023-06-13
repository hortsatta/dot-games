import type { StateCreator } from 'zustand';
import type { CoreSlice } from './core.store';
import type { CartItem } from '#/types/cart.type';
import type { WishListSlice } from './wish-list.store';
import type { OrderSlice } from './order.store';

type CartStoreState = {
  cartItems: CartItem[];
  id?: number;
  piClientSecret?: string;
};

export type CartSlice = {
  cart?: CartStoreState;
  setCart: (cart?: CartStoreState) => void;
  setClientSecret: (clientSecret?: string) => void;
};

export const createCartSlice: StateCreator<
  CoreSlice & CartSlice & WishListSlice & OrderSlice,
  [],
  [],
  CartSlice
> = (set, get) => ({
  cart: undefined,
  setCart: (cart?: CartStoreState) => set({ cart }),
  setClientSecret: (clientSecret?: string) => {
    const cart = get().cart;

    if (!cart) {
      return;
    }

    set({ cart: { ...cart, piClientSecret: clientSecret } });
  },
});
