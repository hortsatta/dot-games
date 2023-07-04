'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { getCartByUserId } from '#/api/cart.api';
import { getWishListByUserId } from '#/api/wish-list.api';
import { useBoundStore } from '#/hooks/use-store.hook';

import type { ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '#/types/database.type';

type Props = {
  children: ReactNode;
};

const Context = createContext<
  { supabase: SupabaseClient<Database> } | undefined
>(undefined);

const CoreSupabaseProvider = ({ children }: Props) => {
  const setCurrentUserId = useBoundStore((state) => state.setCurrentUserId);
  const setCart = useBoundStore((state) => state.setCart);
  const setWishList = useBoundStore((state) => state.setWishList);
  const [supabase] = useState(() =>
    createBrowserSupabaseClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }),
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      const currentUserId = session?.user.id || null;
      setCurrentUserId(currentUserId);

      if (!!currentUserId) {
        // Get and set user's existing cart and wish list
        const cart = await getCartByUserId(supabase, currentUserId);
        const wishList = await getWishListByUserId(supabase, currentUserId);

        setCart(cart ? { id: cart.id, cartItems: cart.cartItems } : undefined);
        setWishList(
          wishList
            ? {
                gameProductIds: wishList.gameProducts.map(
                  (gp) => gp.gameProductId,
                ),
              }
            : undefined,
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
};

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};

export default CoreSupabaseProvider;
