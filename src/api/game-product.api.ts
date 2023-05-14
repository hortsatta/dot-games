import camelcaseKeys from 'camelcase-keys';
import { getAllGenres } from './genre.api';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { Game, GameDb } from '#/types/game.type';
import type { GameProduct, GameProductDb } from '#/types/game-product.type';
import type { Genre } from '#/types/genre.type';
import type { BaseOrderBy } from '#/types/base.type';

async function getRawgGamesByGames(
  supabase: SupabaseClient<Database>,
  data: GameDb['Row'][],
): Promise<Game[]> {
  const allGenres = await getAllGenres(supabase);

  const games = await Promise.all(
    data?.map(async (g) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_RAWG_API_URL}/games/${g.slug}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`,
      );

      const {
        slug: rawg_slug,
        name,
        description,
        metacritic,
        metacritic_url,
        released,
        tba,
        background_image,
        background_image_additional,
        website,
        parent_platforms,
        platforms,
        developers,
        publishers,
        esrb_rating,
      } = await res.json();

      const genres = g.genres
        .map((genreId: number) =>
          allGenres.find((genre: Genre) => genre.id === genreId),
        )
        .filter((genre) => !!genre) as Genre[];

      return {
        id: g.id,
        createdAt: g.created_at,
        isActive: g.is_active,
        bgImageOffsetPosX: g.bg_image_offset_posx,
        bgImageOffsetPosY: g.bg_image_offset_posy,
        backdropOpacity: g.backdrop_opacity || 0.6,
        slug: g.custom_slug || rawg_slug,
        name,
        description,
        metaScore: +metacritic / 2 / 10,
        metacriticUrl: metacritic_url,
        released,
        tba,
        bgImage: background_image,
        bgImageAdditional: background_image_additional,
        website,
        parentPlatforms: parent_platforms
          .map(({ platform }: any) => platform.slug)
          .filter((p: string) => p !== 'mac' && p !== 'linux'),
        platforms: platforms.map(({ platform }: any) => ({
          slug: platform.slug,
          name: platform.name,
        })),
        developers: developers.map(({ slug, name }: any) => ({
          slug,
          name,
        })),
        publishers: publishers.map(({ slug, name }: any) => ({
          slug,
          name,
        })),
        genres,
        esrbRating: esrb_rating
          ? { slug: esrb_rating.slug, name: esrb_rating.name }
          : null,
      };
    }),
  );

  return games || [];
}

export async function getGameProductsByIds(
  supabase: SupabaseClient<Database>,
  ids: number[],
): Promise<GameProduct[]> {
  try {
    const { data: gameProductData } = await supabase
      .from('game_product')
      .select()
      .is('is_active', true)
      .in('id', ids);

    const gameIds = [
      ...new Set(gameProductData?.map(({ game_ids }) => game_ids).flat()),
    ];

    const { data: gameData } = await supabase
      .from('game')
      .select()
      .is('is_active', true)
      .in('id', gameIds);

    const rawgGames = await getRawgGamesByGames(supabase, gameData || []);

    const gameProducts = gameProductData?.map(({ game_ids, ...moreGp }) => {
      const discount =
        moreGp.discount > 0 ? Math.min(Math.max(moreGp.discount, 0), 100) : 0;

      const finalPrice = Number(
        !!discount
          ? (moreGp.price * ((100 - discount) / 100)).toFixed(2)
          : moreGp.price.toFixed(2),
      );

      const games = game_ids
        .map((id: number) => rawgGames.find((g: any) => g.id === id))
        .filter((g) => !!g) as Game[];

      return camelcaseKeys({
        ...moreGp,
        discount,
        finalPrice,
        games,
      });
    });

    return gameProducts || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

const defaultOptions = {
  limit: 10,
};

export async function getLatestReleasedGameProducts(
  supabase: SupabaseClient<Database>,
  options = defaultOptions,
): Promise<GameProduct[]> {
  // Get current date and set time to 0
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const { limit } = options;

  try {
    const { data: gameProductData } = await supabase
      .from('game_product')
      .select()
      .is('is_active', true)
      .order('created_at', { ascending: false })
      .limit(100);

    const gameIds = [
      ...new Set(gameProductData?.map(({ game_ids }) => game_ids).flat()),
    ];

    const { data: gameData } = await supabase
      .from('game')
      .select()
      .is('is_active', true)
      .in('id', gameIds);

    const rawgGames = await getRawgGamesByGames(supabase, gameData || []);
    const latestRawgGames = rawgGames
      .filter((g) => new Date(g.released) <= currentDate)
      .sort(
        (aGame, bGame) => +new Date(bGame.released) - +new Date(aGame.released),
      )
      .slice(0, limit - 1);

    let latestGpData: GameProductDb['Row'][] = [];
    latestRawgGames.forEach((rawgGame) => {
      const target = gameProductData?.find(
        (gp) => !!gp.game_ids.find((g) => g === rawgGame.id),
      );
      !!target && latestGpData.push(target);
    });

    const gameProducts = latestGpData.map(({ game_ids, ...moreGp }) => {
      const discount =
        moreGp.discount > 0 ? Math.min(Math.max(moreGp.discount, 0), 100) : 0;

      const finalPrice = Number(
        !!discount
          ? (moreGp.price * ((100 - discount) / 100)).toFixed(2)
          : moreGp.price.toFixed(2),
      );

      const games = game_ids
        .map((id: number) => rawgGames.find((g: any) => g.id === id))
        .filter((g) => !!g) as Game[];

      return camelcaseKeys({
        ...moreGp,
        discount,
        finalPrice,
        games,
      });
    });

    return gameProducts;
  } catch (error) {
    return [];
  }
}
