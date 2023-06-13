import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { Cart, CartItem } from '#/types/cart.type';

export async function getCartByUserId(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Cart | null> {
  try {
    const { data, error } = await supabase
      .from('cart')
      .select('id,created_at,cart_items')
      .eq('user_id', userId)
      .single();

    if (error) {
      return null;
    }

    const { cart_items, ...moreData } = data;
    const cartItems =
      cart_items?.map((item: { game_product_id: string; quantity: string }) =>
        camelcaseKeys(item),
      ) || [];

    return camelcaseKeys({ ...moreData, cartItems });
  } catch (error) {
    throw error;
  }
}

export async function createCart(
  supabase: SupabaseClient<Database>,
  userId: string,
  cartItems?: CartItem[],
): Promise<Cart> {
  try {
    const { data, error } = await supabase
      .from('cart')
      .insert({ user_id: userId, cart_items: cartItems || [] })
      .select()
      .single();

    if (error) {
      throw error;
    }

    const { payment_intent_id, cart_items, ...moreData } = data;

    return camelcaseKeys({
      ...moreData,
      cartItems:
        cart_items?.map((item: { game_product_id: string; quantity: string }) =>
          camelcaseKeys(item),
        ) || [],
    });
  } catch (error) {
    throw error;
  }
}

export async function updateCartItems(
  supabase: SupabaseClient<Database>,
  userId: string,
  cartItems: CartItem[],
): Promise<CartItem[]> {
  try {
    const row = snakecaseKeys({ cartItems });

    const { data, error } = await supabase
      .from('cart')
      .update(row)
      .eq('user_id', userId)
      .select('id,created_at,cart_items')
      .single();

    if (error) {
      throw error;
    }

    return (
      data.cart_items?.map(
        (item: { game_product_id: string; quantity: string }) =>
          camelcaseKeys(item),
      ) || []
    );
  } catch (error) {
    throw error;
  }
}

export async function clearCartById(
  supabase: SupabaseClient<Database>,
  id: number,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cart')
      .update({ cart_items: null, payment_intent_id: null })
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
}
