import camelcaseKeys from 'camelcase-keys';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { WishList } from '#/types/wish-list.type';

export async function getWishListByUserId(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<WishList | null> {
  try {
    const { data, error } = await supabase
      .from('wish_list')
      .select()
      .eq('user_id', userId)
      .single();

    if (error) {
      return null;
    }

    const { game_product_ids, ...moreData } = data;
    const gameProducts = game_product_ids.map((gameProductId) => ({
      gameProductId,
    }));

    return camelcaseKeys({ gameProducts, ...moreData });
  } catch (error) {
    throw error;
  }
}

export async function createWishList(
  supabase: SupabaseClient<Database>,
  userId: string,
  gameProductIds?: number[],
): Promise<WishList> {
  try {
    const { data, error } = await supabase
      .from('wish_list')
      .insert({ user_id: userId, game_product_ids: gameProductIds || [] })
      .select()
      .single();

    if (error) {
      throw error;
    }

    const { game_product_ids, ...moreData } = data;
    const gameProducts = game_product_ids.map((gameProductId) => ({
      gameProductId,
    }));

    return camelcaseKeys({ gameProducts, ...moreData });
  } catch (error) {
    throw error;
  }
}

export async function updateWishListGameProducts(
  supabase: SupabaseClient<Database>,
  userId: string,
  gameProductIds: number[],
): Promise<number[]> {
  try {
    const { data, error } = await supabase
      .from('wish_list')
      .update({ game_product_ids: gameProductIds })
      .eq('user_id', userId)
      .select('game_product_ids')
      .single();

    if (error) {
      throw error;
    }

    return data.game_product_ids;
  } catch (error) {
    throw error;
  }
}
