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

const CoreWishListNav = memo(function CoreCartNav({ to, ...moreProps }: Props) {
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
    </div>
  );
});

export default CoreWishListNav;
