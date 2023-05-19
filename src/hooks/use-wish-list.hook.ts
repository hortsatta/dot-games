import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createWishList,
  updateWishListGameProducts,
} from '#/api/wish-list.api';
import { getGameProductsByIds } from '#/api/game-product.api';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';
import { useTimeout } from './use-timeout.hook';

import type { GameProduct } from '#/types/game-product.type';
import type { WishListGameProduct } from '#/types/wish-list.type';

type Result = {
  initialLoading: boolean;
  loading: boolean;
  wishListGameProducts: WishListGameProduct[];
  toggleGameProduct: (gameProductId: number) => Promise<boolean>;
  emptyWishList: () => Promise<boolean>;
};

export const useWishList = (loadGameProducts?: boolean): Result => {
  const { supabase } = useSupabase();
  const setShowLogin = useBoundStore((state) => state.setShowLogin);
  const currentUserId = useBoundStore((state) => state.currentUserId);
  const wishList = useBoundStore((state) => state.wishList);
  const setWishList = useBoundStore((state) => state.setWishList);
  const [gameProducts, setGameProducts] = useState<GameProduct[]>([]);
  const { timeoutFn: delayedSetWishList } = useTimeout(setWishList);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const wishListGameProducts = useMemo(() => {
    if (!wishList || !currentUserId) {
      return [];
    } else if (!gameProducts.length) {
      return wishList.gameProductIds.map((gameProductId) => ({
        gameProductId,
      }));
    }

    return (
      wishList?.gameProductIds.map((gameProductId) => {
        const gameProduct = gameProducts.find(
          ({ id }) => id === gameProductId,
        ) as GameProduct;
        return {
          gameProductId,
          gameProduct,
        };
      }) || []
    );
  }, [wishList, gameProducts, currentUserId]);

  useEffect(() => {
    if (!wishList || !loadGameProducts) {
      setInitialLoading(false);
      return;
    }

    (async () => {
      const gps = await getGameProductsByIds(
        supabase,
        wishList.gameProductIds.map((id) => Number(id)),
      );

      setInitialLoading(false);
      !!gps.length && setGameProducts(gps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadGameProducts]);

  const toggleGameProduct = useCallback(
    async (gameProductId: number) => {
      if (!currentUserId) {
        setShowLogin(true);
        return false;
      }

      try {
        setLoading(true);

        // If wish lish does not exist yet then create empty wish list on store
        // and on supabase if user has logged-in
        if (!wishList) {
          await createWishList(supabase, currentUserId, [gameProductId]);
          await delayedSetWishList({ gameProductIds: [gameProductId] });
          return true;
        }

        // Else add or remove gameproductId to existing wishList
        const isExisting = wishList.gameProductIds.some(
          (id) => id === gameProductId,
        );

        let newGameProductIds = [];
        if (isExisting) {
          newGameProductIds = wishList.gameProductIds.filter(
            (id) => id !== gameProductId,
          );
        } else {
          newGameProductIds = [...wishList.gameProductIds, gameProductId];
        }

        await updateWishListGameProducts(
          supabase,
          currentUserId,
          newGameProductIds,
        );

        await delayedSetWishList({
          ...wishList,
          gameProductIds: newGameProductIds,
        });

        return true;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wishList, currentUserId],
  );

  const emptyWishList = useCallback(async () => {
    if (!currentUserId) {
      return false;
    }

    try {
      setInitialLoading(true);

      await updateWishListGameProducts(supabase, currentUserId, []);
      await delayedSetWishList({ ...wishList, gameProductIds: [] });

      return true;
    } catch (error) {
      throw error;
    } finally {
      setInitialLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishList, currentUserId]);

  return {
    initialLoading,
    loading,
    wishListGameProducts,
    toggleGameProduct,
    emptyWishList,
  };
};
