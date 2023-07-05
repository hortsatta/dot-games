import { useCallback, useEffect, useState } from 'react';

import { getOrdersByUserId } from '#/api/order.api';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';

import type { OrderSummary } from '#/types/order.type';

type Result = {
  initialLoading: boolean;
  orders: OrderSummary[];
};

export const useOrders = (): Result => {
  const { supabase } = useSupabase();
  const currentUserId = useBoundStore((state) => state.currentUserId);
  const [orders, setOrders] = useState<OrderSummary[] | undefined>(undefined);

  const fetchOrders = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    try {
      const currentOrders = await getOrdersByUserId(supabase, currentUserId);
      setOrders(currentOrders);
    } catch (error) {
      setOrders([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();
  }, [fetchOrders]);

  return {
    initialLoading: orders === undefined,
    orders: orders || [],
  };
};
