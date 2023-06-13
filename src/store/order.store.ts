import type { StateCreator } from 'zustand';
import type { CartSlice } from './cart.store';
import type { CoreSlice } from './core.store';
import type { WishListSlice } from './wish-list.store';

export type OrderSlice = {
  orderId?: number;
  setOrderId: (id?: number) => void;
};

export const createOrderSlice: StateCreator<
  CoreSlice & CartSlice & WishListSlice & OrderSlice,
  [],
  [],
  OrderSlice
> = (set) => ({
  orderId: undefined,
  setOrderId: (id?: number) => set({ orderId: id }),
});
