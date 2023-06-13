import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createCoreSlice } from '#/store/core.store';
import { createCartSlice } from '#/store/cart.store';
import { createWishListSlice } from '#/store/wish-list.store';
import { createOrderSlice } from '#/store/order.store';

import type { CartSlice } from '#/store/cart.store';
import type { CoreSlice } from '#/store/core.store';
import type { WishListSlice } from '#/store/wish-list.store';
import { OrderSlice } from '#/store/order.store';

export const useBoundStore = create<
  CoreSlice & CartSlice & WishListSlice & OrderSlice
>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createCoreSlice(...a),
        ...createCartSlice(...a),
        ...createWishListSlice(...a),
        ...createOrderSlice(...a),
      })),
      {
        name: 'main-store',
        partialize: (state) => ({
          isDarkMode: state.isDarkMode,
          cart: state.cart,
        }),
      },
    ),
  ),
);
