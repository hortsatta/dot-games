'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getOrderById } from '#/api/order.api';
import { useBoundStore } from '#/hooks/use-store.hook';
import { useSupabase } from '#/components/core/core-supabase-provider';
import BaseIcon from '#/components/base/base-icon.component';
import BaseButton from '#/components/base/base-button.component';
import BaseScene from '#/components/base/base-scene.component';
import BaseTypography from '#/components/base/base-typography.component';

import type { Order } from '#/types/order.type';

const OrderSuccess = () => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const orderId = useBoundStore((state) => state.orderId);
  const setOrderId = useBoundStore((state) => state.setOrderId);
  const [currentOrder, setCurrentOrder] = useState<Order | null | undefined>(
    undefined,
  );

  const formattedOrderId = useMemo(
    () => currentOrder?.id.toString().padStart(11, '0'),
    [currentOrder],
  );

  useEffect(() => {
    if (!orderId) {
      setCurrentOrder(null);
      return;
    }

    (async () => {
      const order = await getOrderById(supabase, orderId);
      setCurrentOrder(order);
    })();

    return () => {
      setOrderId();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (currentOrder === null) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder]);

  return (
    <BaseScene>
      {currentOrder !== undefined && (
        <div className='max-w-main mx-auto text-center'>
          <div className='pb-4 pt-16 flex flex-col items-center justify-start'>
            <BaseIcon
              name='check-circle'
              className='fill-green-500'
              width={64}
              height={64}
            />
            <BaseTypography
              className='mt-2 mb-6 font-medium uppercase'
              variant='h4'
            >
              Thank you for your purchase
            </BaseTypography>
            <span className='text-current-dark'>
              Your order number is{' '}
              <span className='font-bold'>{formattedOrderId}</span>
            </span>
          </div>
          <div>
            <BaseButton onClick={() => router.push('/')}>
              Return to Main Page
            </BaseButton>
          </div>
        </div>
      )}
    </BaseScene>
  );
};

export default OrderSuccess;
