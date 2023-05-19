import { useEffect, useState } from 'react';

import { getGameProductsBySlug } from '#/api/game-product.api';
import { useSupabase } from '#/components/core/core-supabase-provider';

import type { GameProduct } from '#/types/game-product.type';

type Result = {
  gameProducts: GameProduct[] | undefined;
};

export const useGameProducts = (slug: string): Result => {
  const { supabase } = useSupabase();
  const [gameProducts, setGameProducts] = useState<GameProduct[] | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const gps = await getGameProductsBySlug(supabase, slug);
      setGameProducts(gps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return { gameProducts };
};
