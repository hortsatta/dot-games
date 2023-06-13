import camelcaseKeys from 'camelcase-keys';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { Order } from '#/types/order.type';

export async function getOrderById(
  supabase: SupabaseClient<Database>,
  id: number,
): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('order')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return camelcaseKeys(data) as Order;
  } catch (error) {
    return null;
  }
}

export async function getOrdersByUserId(
  supabase: SupabaseClient<Database>,
  userId: number,
): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('order')
      .select()
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      return [];
    }

    return data.map((item) => camelcaseKeys(item)) as Order[];
  } catch (error) {
    return [];
  }
}
