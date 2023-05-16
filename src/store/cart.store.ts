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
  subtractCartItem: (cartItem: CartItem) => void;
  removeCartItem: (gameProductId: number) => void;
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
  subtractCartItem: (cartItem: CartItem) =>
    set((state) => {
      if (!state.cart) {
        return {};
      }

      const filteredCartItems = state.cart.cartItems
        .map((item) => {
          if (item.gameProductId !== cartItem.gameProductId) {
            return item;
          }

          return {
            ...item,
            quantity: Math.max(0, item.quantity - cartItem.quantity),
          };
        })
        .filter((item) => !!item.quantity);

      return {
        cart: {
          ...state.cart,
          cartItems: filteredCartItems,
        },
      };
    }),
  removeCartItem: (gameProductId: number) =>
    set((state) => {
      if (!state.cart) {
        return {};
      }

      return {
        cart: {
          ...state.cart,
          cartItems: state.cart?.cartItems.filter(
            (item) => item.gameProductId !== gameProductId,
          ),
        },
      };
    }),
});
