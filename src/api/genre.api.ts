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

    const { data: genreData, error } = await supabase
      .from('genre')
      .select()
      .is('is_active', true)
      .order(orderBy.columnName, { ascending: orderBy.ascending });

    if (error) {
      return [];
    }

    const genres = await Promise.all(
      genreData.map(async ({ custom_slug, ...moreGenre }) => {
        const { data: image } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || '')
          .getPublicUrl(`images/genres/genre-${moreGenre.slug}.png`);

        return camelcaseKeys({
          ...moreGenre,
          slug: custom_slug || moreGenre.slug,
          coverImage: image.publicUrl,
        });
      }),
    );

    return genres;
  } catch (error) {
    return [];
  }
}

export async function getGenreBySlug(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<Genre | null> {
  try {
    // Set filter and fetch main game
    const slugFilter = `slug.eq.${slug},custom_slug.eq.${slug}`;
    const { data: genreData, error } = await supabase
      .from('genre')
      .select()
      .is('is_active', true)
      .or(slugFilter)
      .single();

    if (error) {
      return null;
    }

    const { custom_slug, ...moreGenre } = genreData;
    const { data: image } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || '')
      .getPublicUrl(`images/genres/genre-${moreGenre.slug}.png`);

    return camelcaseKeys({
      ...moreGenre,
      slug: custom_slug || moreGenre.slug,
      coverImage: image.publicUrl,
    });
  } catch (error) {
    return null;
  }
}
