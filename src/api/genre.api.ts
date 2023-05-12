import camelcaseKeys from 'camelcase-keys';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { BaseOrderBy } from '#/types/base.type';
import type { Genre, GenreDb } from '#/types/genre.type';

const defaultOrderBy: BaseOrderBy<GenreDb['Row']> = {
  columnName: 'name',
  ascending: true,
};

const defaultOptions = {
  orderBy: defaultOrderBy,
};

export async function getAllGenres(
  supabase: SupabaseClient<Database>,
  options = defaultOptions,
): Promise<Genre[]> {
  try {
    const { orderBy } = options;

    const { data } = await supabase
      .from('genre')
      .select()
      .is('is_active', true)
      .order(orderBy.columnName, { ascending: orderBy.ascending });

    return (
      data?.map(({ custom_slug, ...moreGenre }) =>
        camelcaseKeys({ ...moreGenre, slug: custom_slug || moreGenre.slug }),
      ) || []
    );
  } catch (error) {
    return [];
  }
}
