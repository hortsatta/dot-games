import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { CartItem } from '#/types/cart.type';
import type { Database } from '#/types/database.type';
import type { Order } from '#/types/order.type';

export async function createPaymentIntent(
  cartItems: CartItem[],
  cartId: number,
): Promise<string> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout/create-payment-intent`,
      {
        method: 'POST',
        body: JSON.stringify({ cartItems, cartId }),
      },
    );

    const data = await res.json();
    return data.pi_client_secret;
  } catch (error) {
    throw error;
  }
}

export async function completeOrder(
  supabase: SupabaseClient<Database>,
  order: Omit<Order, 'id' | 'createdAt'>,
): Promise<Order> {
  try {
    const row = snakecaseKeys(order);

    const { data, error } = await supabase
      .from('order')
      .insert(row)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return camelcaseKeys(data) as Order;
  } catch (error) {
    throw error;
  }
}
