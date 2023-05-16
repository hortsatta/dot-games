'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import isEqual from 'react-fast-compare';

import { useBoundStore } from '#/hooks/use-store.hook';
import BaseIcon from '../base/base-icon.component';
import BaseNavItem from '../base/base-nav-item.component';

import type { ComponentProps } from 'react';
import type { CartItem } from '#/types/cart.type';

type Props = Omit<ComponentProps<typeof BaseNavItem>, 'children'>;

const plusOneWrapperAnimate = {
  initial: { left: '50%', opacity: 0 },
  animate: {
    left: '50%',
    opacity: 1,
    transition: {
      left: { duration: 2 },
      opacity: { duration: 0.1 },
    },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const plusOneAnimate = {
  initial: { x: '-70%', y: 30, scale: 0.5, rotate: 0 },
  animate: {
    x: '-70%',
    y: 10,
    scale: 1,
    transition: {
      scale: { duration: 0.1 },
      y: { type: 'spring', stiffness: 200 },
    },
  },
};

const CoreCartNav = memo(function CoreCartNav({ to }: Props) {
  const [newItems, setNewItems] = useState<string[]>([]);
  const unsub = useBoundStore.subscribe(
    (state) => state.cart?.cartItems,
    (cartItems, previouseCartItems) =>
      handleCartItems(cartItems, previouseCartItems),
  );

  useEffect(() => {
    () => unsub;
  }, [unsub]);

  const handleCartItems = useCallback(
    async (cartItems?: CartItem[], previouseCartItems?: CartItem[]) => {
      if (isEqual(cartItems, previouseCartItems)) {
        return;
      }

      // Check if cart action is add not substract
      // Only do animation if item is added to cart
      const itemCount =
        cartItems?.reduce((total, current) => total + current.quantity, 0) || 0;
      const prevItemCount =
        previouseCartItems?.reduce(
          (total, current) => total + current.quantity,
          0,
        ) || 0;
      if (itemCount <= prevItemCount) {
        return;
      }

      setNewItems([...newItems, crypto.randomUUID()]);
    },
    [newItems],
  );

  const handleAnimationComplete = useCallback(
    (key: string) => {
      setNewItems(newItems.filter((item) => item !== key));
    },
    [newItems],
  );

  return (
    <div className='relative'>
      <BaseNavItem to={to}>
        <BaseIcon
          name='flying-saucer'
          className='dark:fill-current-dark/100'
          width={28}
          height={28}
        />
      </BaseNavItem>
      <AnimatePresence>
        {newItems.map((key) => (
          <motion.div
            key={key}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            onAnimationComplete={() => handleAnimationComplete(key)}
            {...plusOneWrapperAnimate}
          >
            <BaseIcon
              name='flying-saucer'
              className='fill-primary'
              width={28}
              height={28}
              weight='fill'
            />
            <motion.div
              className='flex items-center absolute left-1/2 top-1/2 z-10'
              {...plusOneAnimate}
            >
              <BaseIcon
                name='plus'
                className='fill-current-dark'
                width={12}
                height={12}
              />
              <div className='relative'>
                <BaseIcon
                  name='number-circle-one'
                  className='fill-primary'
                  width={22}
                  height={22}
                  weight='fill'
                />
                <div className='absolute top-0 left-0'>
                  <BaseIcon
                    name='number-circle-one'
                    className='fill-current-dark'
                    width={22}
                    height={22}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default CoreCartNav;
