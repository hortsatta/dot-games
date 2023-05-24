import { useEffect, useState } from 'react';

import { getAllGenres } from '#/api/genre.api';
import { useSupabase } from '#/components/core/core-supabase-provider';

import type { Genre } from '#/types/genre.type';

type Result = {
  initialLoading: boolean;
  genres: Genre[] | undefined;
};

export const useGenres = (): Result => {
  const { supabase } = useSupabase();
  const [genres, setGenres] = useState<Genre[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const list = await getAllGenres(supabase);
      setGenres(list);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { initialLoading: genres === undefined, genres };
};
