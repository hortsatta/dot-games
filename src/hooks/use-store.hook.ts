import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createCoreSlice } from '#/store/core.store';
import { createCartSlice } from '#/store/cart.store';
import { WishListSlice, createWishListSlice } from '#/store/wish-list.store';

import type { CartSlice } from '#/store/cart.store';
import type { CoreSlice } from '#/store/core.store';

export const useBoundStore = create<CoreSlice & CartSlice & WishListSlice>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createCoreSlice(...a),
        ...createCartSlice(...a),
        ...createWishListSlice(...a),
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
