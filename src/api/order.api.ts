import camelcaseKeys from 'camelcase-keys';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { Order, OrderSummary } from '#/types/order.type';

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
  userId: string,
): Promise<OrderSummary[]> {
  try {
    const { data, error } = await supabase
      .from('order')
      .select('id,date,order_items,total_amount,status')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      return [];
    }

    const orders = data.map(({ order_items, ...moreData }) => {
      const itemCount =
        order_items?.reduce(
          (total: number, current: any) => total + current.quantity,
          0,
        ) || 0;
      return camelcaseKeys({ itemCount, ...moreData });
    }) as OrderSummary[];

    return orders;
  } catch (error) {
    return [];
  }
}
