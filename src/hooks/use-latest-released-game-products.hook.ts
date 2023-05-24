import { useEffect, useState } from 'react';

import { useSupabase } from '#/components/core/core-supabase-provider';
import { getLatestReleasedGameProducts } from '#/api/game-product.api';

import type { GameProduct } from '#/types/game-product.type';

type Result = {
  gameProducts: GameProduct[] | undefined;
};

export const useLatestReleasedGameProducts = (): Result => {
  const { supabase } = useSupabase();
  const [gameProducts, setGameProducts] = useState<GameProduct[] | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const carouselItems = await getLatestReleasedGameProducts(supabase);
      setGameProducts(carouselItems);
    })();
  }, [supabase]);

  return { gameProducts };
};
