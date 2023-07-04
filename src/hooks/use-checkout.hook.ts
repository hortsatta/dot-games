import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getGameProductsByIds } from '#/api/game-product.api';
import { clearCartById } from '#/api/cart.api';
import {
  completeOrder as completeOrderDb,
  createPaymentIntent,
} from '#/api/checkout.api';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';

import type { PaymentIntent } from '@stripe/stripe-js';
import type { CartItem } from '#/types/cart.type';
import type { GameProduct } from '#/types/game-product.type';
import type { Address } from '#/types/address.type';
import type { UserAccount } from '#/types/user-account.type';
import type { Order, OrderItem } from '#/types/order.type';

type Result = {
  loading: boolean;
  checkoutCartItems: CartItem[];
  cartItemCount: number;
  shippingFee: number;
  subTotalAmount: number;
  totalAmount: number;
  shippingAddress: Address | null;
  changeShippingAddress: (address: Address) => void;
  doCheckout: () => Promise<void>;
  placeOrder: () => Promise<boolean>;
  completeOrder: (
    paymentIntent: PaymentIntent,
    userAccount: UserAccount,
    successUrl?: string,
  ) => Promise<void>;
  piClientSecret?: string;
};

const SHIPPING_FEE = 0;

export const useCheckout = (): Result => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const currentUserId = useBoundStore((state) => state.currentUserId);
  const setShowLogin = useBoundStore((state) => state.setShowLogin);
  const cart = useBoundStore((state) => state.cart);
  const setCart = useBoundStore((state) => state.setCart);
  const setClientSecret = useBoundStore((state) => state.setClientSecret);
  const setOrderId = useBoundStore((state) => state.setOrderId);
  const [gameProducts, setGameProducts] = useState<GameProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

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
  }, [cart]);

  const changeShippingAddress = useCallback((address: Address) => {
    setShippingAddress(address);
  }, []);

  const doCheckout = useCallback(async () => {
    // Show login dialog if no current user
    if (!currentUserId) {
      setShowLogin('/cart');
      return;
    }

    try {
      setLoading(true);
      const clientSecret = await createPaymentIntent(
        cart?.cartItems || [],
        cart?.id || 0,
      );

      if (!!clientSecret?.trim()) {
        setClientSecret(clientSecret);
        router.push('/checkout');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, currentUserId]);

  const placeOrder = useCallback(async () => {
    try {
      setLoading(true);
      const clientSecret = await createPaymentIntent(
        cart?.cartItems || [],
        cart?.id || 0,
      );

      if (!!clientSecret.trim()) {
        setClientSecret(clientSecret);
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const completeOrder = useCallback(
    async (
      paymentIntent: PaymentIntent,
      userAccount: UserAccount,
      successUrl?: string,
    ) => {
      if (
        !shippingAddress ||
        !paymentIntent.client_secret ||
        !userAccount.userId ||
        !cart?.id
      ) {
        throw new Error('An error occurred!');
      }

      try {
        setLoading(true);

        const orderItems: OrderItem[] = checkoutCartItems.map((item) => {
          const { games, ...moreGameProduct } = item.gameProduct;
          const gameIds = games.map((g) => g.id);

          return {
            item: { ...moreGameProduct, gameIds },
            quantity: item.quantity,
          };
        });

        const newOrder: Omit<Order, 'id' | 'createdAt'> = {
          orderItems,
          address: shippingAddress,
          piClientSecret: paymentIntent.client_secret,
          userId: userAccount.userId,
          shippingFee: SHIPPING_FEE,
          totalAmount,
          status: 1,
        };

        const orderResult = await completeOrderDb(supabase, newOrder);
        const clearCartResult = await clearCartById(supabase, cart.id);

        if (!clearCartResult) {
          throw new Error('An error occurred!');
        }

        setOrderId(orderResult.id);
        setCart({ ...cart, cartItems: [], piClientSecret: undefined });

        !!successUrl && router.push(successUrl);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkoutCartItems, shippingAddress, totalAmount, cart],
  );

  return {
    loading,
    checkoutCartItems,
    cartItemCount,
    shippingFee: SHIPPING_FEE,
    subTotalAmount,
    totalAmount,
    shippingAddress,
    changeShippingAddress,
    doCheckout,
    placeOrder,
    completeOrder,
    piClientSecret: cart?.piClientSecret,
  };
};
