import { useEffect, useState } from 'react';

import { useSupabase } from '#/components/core/core-supabase-provider';
import { getDiscountedGameProducts } from '#/api/game-product.api';

import type { GameProduct } from '#/types/game-product.type';

type Result = {
  initialLoading: boolean;
  gameProducts: GameProduct[] | undefined;
};

export const useDiscountedGameProducts = (): Result => {
  const { supabase } = useSupabase();
  const [gameProducts, setGameProducts] = useState<GameProduct[] | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const carouselItems = await getDiscountedGameProducts(supabase);
      setGameProducts(carouselItems);
    })();
  }, [supabase]);

  return { initialLoading: gameProducts === undefined, gameProducts };
};
