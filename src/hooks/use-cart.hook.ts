import { useCallback, useState } from 'react';

import { createCart, updateCartItems } from '#/api/cart.api';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';
import { useTimeout } from './use-timeout.hook';

import type { CartItem } from '#/types/cart.type';

type Result = {
  loading: boolean;
  addCartItem: (cartItem: CartItem) => Promise<number>;
  subtractCartItem: (cartItem: CartItem) => Promise<number>;
  removeCartItem: (gameProductId: number) => Promise<boolean>;
  emptyCartItems: () => Promise<boolean>;
};

export const useCart = (): Result => {
  const { supabase } = useSupabase();
  const currentUserId = useBoundStore((state) => state.currentUserId);
  const cart = useBoundStore((state) => state.cart);
  const setCart = useBoundStore((state) => state.setCart);
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
          return cartItem.quantity;
        }

        // Else add gameproduct to existing cart
        const targetItem = cart?.cartItems.find(
          ({ gameProductId }) => cartItem.gameProductId === gameProductId,
        );

        let targetItemQuantity = 0;
        let newCartItems: CartItem[] = [];
        if (!targetItem) {
          newCartItems = [...(cart?.cartItems || []), cartItem];
        } else {
          newCartItems =
            cart?.cartItems.map((item) => {
              if (item.gameProductId !== targetItem.gameProductId) {
                return item;
              }

              targetItemQuantity = item.quantity + cartItem.quantity;

              return { ...item, quantity: targetItemQuantity };
            }) || [];
        }

        if (!!currentUserId) {
          await updateCartItems(supabase, currentUserId, newCartItems);
        }

        await delayedSetCart({ ...cart, cartItems: newCartItems });

        return targetItemQuantity;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, currentUserId],
  );

  const subtractCartItem = useCallback(
    async (cartItem: CartItem) => {
      try {
        setLoading(true);

        let targetItemQuantity = 0;
        const filteredCartItems: CartItem[] =
          cart?.cartItems
            .map((item) => {
              if (item.gameProductId !== cartItem.gameProductId) {
                return item;
              }

              targetItemQuantity = Math.max(
                0,
                item.quantity - cartItem.quantity,
              );

              return { ...item, quantity: targetItemQuantity };
            })
            .filter((item) => !!item.quantity) || [];

        if (!!currentUserId) {
          await updateCartItems(supabase, currentUserId, filteredCartItems);
        }

        await delayedSetCart({ ...cart, cartItems: filteredCartItems });

        return targetItemQuantity;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, currentUserId],
  );

  const removeCartItem = useCallback(
    async (gameProductId: number) => {
      try {
        setLoading(true);

        const filteredCartItems: CartItem[] =
          cart?.cartItems.filter(
            (item) => item.gameProductId !== gameProductId,
          ) || [];

        if (!!currentUserId) {
          await updateCartItems(supabase, currentUserId, filteredCartItems);
        }

        await delayedSetCart({ ...cart, cartItems: filteredCartItems });

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

  const emptyCartItems = useCallback(async () => {
    try {
      setLoading(true);

      if (!!currentUserId) {
        await updateCartItems(supabase, currentUserId, []);
      }

      await delayedSetCart({ ...cart, cartItems: [] });

      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, currentUserId]);

  return {
    loading,
    addCartItem,
    subtractCartItem,
    removeCartItem,
    emptyCartItems,
  };
};
