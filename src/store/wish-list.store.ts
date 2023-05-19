import type { StateCreator } from 'zustand';
import type { CoreSlice } from './core.store';
import { CartSlice } from './cart.store';

type WishListStoreState = { gameProductIds: number[] };

export type WishListSlice = {
  wishList?: WishListStoreState;
  setWishList: (wishList?: WishListStoreState) => void;
};

export const createWishListSlice: StateCreator<
  CoreSlice & CartSlice & WishListSlice,
  [],
  [],
  WishListSlice
> = (set) => ({
  wishList: undefined,
  setWishList: (wishList?: WishListStoreState) => set({ wishList }),
});
