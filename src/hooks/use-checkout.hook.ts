import { useEffect, useMemo, useState } from 'react';

import { getGameProductsByIds } from '#/api/game-product.api';
import { useBoundStore } from './use-store.hook';
import { useSupabase } from '#/components/core/core-supabase-provider';

import type { CartItem } from '#/types/cart.type';
import type { GameProduct } from '#/types/game-product.type';

type Result = {
  loading: boolean;
  checkoutCartItems: CartItem[];
  cartItemCount: number;
  shippingFee: number;
  subTotalAmount: number;
  totalAmount: number;
};

const SHIPPING_FEE = 0;

export const useCheckout = (): Result => {
  const { supabase } = useSupabase();
  const cart = useBoundStore((state) => state.cart);
  const [gameProducts, setGameProducts] = useState<GameProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const checkoutCartItems = useMemo(() => {
    if (!cart || !gameProducts.length) {
      return [];
    }

    return (
      cart?.cartItems.map((item) => {
        const gameProduct = gameProducts.find(
          ({ id }) => id === item.gameProductId,
        ) as GameProduct;
        return {
          ...item,
          gameProduct,
        };
      }) || []
    );
  }, [cart, gameProducts]);

  const cartItemCount = useMemo(
    () =>
      checkoutCartItems.reduce((total, item) => (total += item.quantity), 0),
    [checkoutCartItems],
  );

  const subTotalAmount = useMemo(
    () =>
      checkoutCartItems.reduce((total: number, item: CartItem) => {
        const price = (item.gameProduct?.finalPrice || 0) * item.quantity;
        return total + price;
      }, 0),
    [checkoutCartItems],
  );

  const totalAmount = useMemo(
    () => subTotalAmount + SHIPPING_FEE,
    [subTotalAmount],
  );

  useEffect(() => {
    if (!cart) {
      setLoading(false);
      return;
    }

    (async () => {
      const gps = await getGameProductsByIds(
        supabase,
        cart.cartItems.map(({ gameProductId }) => Number(gameProductId)),
      );

      setLoading(false);
      !!gps.length && setGameProducts(gps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    checkoutCartItems,
    cartItemCount,
    shippingFee: SHIPPING_FEE,
    subTotalAmount,
    totalAmount,
  };
};
