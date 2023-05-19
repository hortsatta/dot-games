'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import isEqual from 'react-fast-compare';

import { useBoundStore } from '#/hooks/use-store.hook';
import BaseIcon from '../base/base-icon.component';
import BaseNavItem from '../base/base-nav-item.component';

import type { ComponentProps } from 'react';

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

const CoreWishListNav = memo(function CoreWishListNav({
  to,
  ...moreProps
}: Props) {
  const [newItems, setNewItems] = useState<string[]>([]);

  const handleWishListGameProducts = useCallback(
    async (gameProducts?: number[], previousGameProducts?: number[]) => {
      if (isEqual(gameProducts, previousGameProducts)) {
        return;
      }

      // Check if wish list action is add not remove
      // Only do animation if item is added to wish list
      if ((gameProducts?.length || 0) <= (previousGameProducts?.length || 0)) {
        return;
      }

      setNewItems([...newItems, crypto.randomUUID()]);
    },
    [newItems],
  );

  const unsub = useBoundStore.subscribe(
    (state) => state.wishList?.gameProductIds,
    (gameProducts, previousGameProducts) =>
      handleWishListGameProducts(gameProducts, previousGameProducts),
  );

  useEffect(() => {
    () => unsub;
  }, [unsub]);

  const removeAnimation = useCallback(
    (key: string) => {
      setNewItems(newItems.filter((item) => item !== key));
    },
    [newItems],
  );

  return (
    <div className='relative h-full'>
      <BaseNavItem to={to} {...moreProps}>
        <BaseIcon
          name='brain'
          className='dark:fill-current-dark/100'
          width={28}
          height={28}
        />
      </BaseNavItem>
      <AnimatePresence>
        {newItems.map((key) => (
          <motion.div
            key={key}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'
            onAnimationComplete={() => removeAnimation(key)}
            onClick={() => removeAnimation(key)}
            {...plusOneWrapperAnimate}
          >
            <div className='relative'>
              <div className='absolute top-0 left-0'>
                <BaseIcon
                  name='brain'
                  className='fill-current-dark/70'
                  width={28}
                  height={28}
                />
              </div>
              <BaseIcon
                name='brain'
                className='fill-secondary'
                width={28}
                height={28}
                weight='fill'
              />
            </div>
            <motion.div
              className='flex items-center absolute left-1/2 top-1/2 z-10'
              {...plusOneAnimate}
            >
              <BaseIcon
                name='plus'
                className='fill-current-dark/70'
                width={12}
                height={12}
              />
              <div className='relative'>
                <BaseIcon
                  name='number-circle-one'
                  className='fill-secondary'
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

export default CoreWishListNav;
