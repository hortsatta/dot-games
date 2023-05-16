import { useCallback, useState } from 'react';

import { createCart, updateCartItems } from '#/api/cart.api';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';
import { useTimeout } from './use-timeout.hook';

import type { CartItem } from '#/types/cart.type';

type Result = {
  loading: boolean;
  addCartItem: (cartItem: CartItem) => Promise<boolean>;
  subtractCartItem: (cartItem: CartItem) => Promise<boolean>;
  removeCartItem: (gameProductId: number) => Promise<boolean>;
};

export const useCart = (): Result => {
  const { supabase } = useSupabase();
  const currentUserId = useBoundStore((state) => state.currentUserId);
  const cart = useBoundStore((state) => state.cart);
  const setCart = useBoundStore((state) => state.setCart);
  const subtractCartItemStore = useBoundStore(
    (state) => state.subtractCartItem,
  );
  const removeCartItemStore = useBoundStore((state) => state.removeCartItem);
  const { timeoutFn: delayedSetCart } = useTimeout(setCart);
  const [loading, setLoading] = useState(false);

  const addCartItem = useCallback(
    async (cartItem: CartItem) => {
      try {
        setLoading(true);

        // If cart does not exist yet then create empty cart on store
        // and on supabase if user has logged-in
        if (!cart) {
          if (!!currentUserId) {
            await createCart(supabase, currentUserId, [cartItem]);
          }

          await delayedSetCart({ cartItems: [cartItem] });
          return true;
        }

        // Else add gameproduct to existing cart
        const targetItem = cart?.cartItems.find(
          ({ gameProductId }) => cartItem.gameProductId === gameProductId,
        );

        let newCartItems: CartItem[] = [];
        if (!targetItem) {
          newCartItems = [...(cart?.cartItems || []), cartItem];
        } else {
          newCartItems =
            cart?.cartItems.map((item) => {
              if (item.gameProductId !== targetItem.gameProductId) {
                return item;
              }

              return { ...item, quantity: item.quantity + cartItem.quantity };
            }) || [];
        }

        if (!!currentUserId) {
          await updateCartItems(supabase, currentUserId, newCartItems);
        }

        await delayedSetCart({ ...cart, cartItems: newCartItems });

        return true;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, currentUserId],
  );

  const subtractCartItem = async (cartItem: CartItem) => {
    try {
      subtractCartItemStore(cartItem);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const removeCartItem = async (gameProductId: number) => {
    try {
      removeCartItemStore(gameProductId);
      return true;
    } catch (error) {
      throw error;
    }
  };

  return {
    loading,
    addCartItem,
    subtractCartItem,
    removeCartItem,
  };
};
