import type { StateCreator } from 'zustand';
import type { CoreSlice } from './core.store';
import type { CartSlice } from './cart.store';
import type { OrderSlice } from './order.store';

type WishListStoreState = { gameProductIds: number[] };

export type WishListSlice = {
  wishList?: WishListStoreState;
  setWishList: (wishList?: WishListStoreState) => void;
};

export const createWishListSlice: StateCreator<
  CoreSlice & CartSlice & WishListSlice & OrderSlice,
  [],
  [],
  WishListSlice
> = (set) => ({
  wishList: undefined,
  setWishList: (wishList?: WishListStoreState) => set({ wishList }),
});
