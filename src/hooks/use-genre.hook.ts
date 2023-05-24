import { useEffect, useState } from 'react';

import { getGenreBySlug } from '#/api/genre.api';
import { getGameProductsByGenre } from '#/api/game-product.api';
import { useSupabase } from '#/components/core/core-supabase-provider';

import type { Genre } from '#/types/genre.type';
import type { GameProduct } from '#/types/game-product.type';

type Result = {
  initialLoading: boolean;
  genre: Genre | null | undefined;
  gameProducts: GameProduct[] | undefined;
};

export const useGenre = (slug: string): Result => {
  const { supabase } = useSupabase();
  const [genre, setGenre] = useState<Genre | null | undefined>(undefined);
  const [gameProducts, setGameProducts] = useState<GameProduct[] | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const currentGenre = await getGenreBySlug(supabase, slug);
      const gps = await getGameProductsByGenre(supabase, currentGenre?.id || 0);
      setGenre(currentGenre);
      setGameProducts(gps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    initialLoading: genre === undefined || gameProducts === undefined,
    genre,
    gameProducts,
  };
};
