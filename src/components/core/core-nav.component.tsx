'use client';

import { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';
import BaseIcon from '../base/base-icon.component';

import navIndicatorLineSrc from '#/assets/images/nav-indicator-line.png';
import navIndicatorPulseSrc from '#/assets/images/nav-indicator-pulse.png';
import mainMenuJson from '#/main-menu.json';

import type { ComponentProps } from 'react';
import type { IconName } from '../base/base-icon.component';

type NavItemProps = ComponentProps<typeof BaseButton> & {
  to: string;
};

const indicatorAnimate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { type: 'tween', duration: 0.1 },
};

const indicatorLightAnimate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { type: 'tween', duration: 0.2 },
};

const pathAnimate = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: 0.1, type: 'spring', duration: 2, bounce: 0 },
};

const lineAnimate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { type: 'tween', duration: 3 },
};

const NavIndicator = memo(function NavIndicator() {
  return (
    <div className='absolute left-1/2 bottom-0 w-[276px] h-full -translate-x-1/2'>
      <div className='relative z-[1]'>
        <motion.svg
          className='relative z-[1]'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 276 19'
        >
          <defs>
            <linearGradient
              id='a'
              x1='-494.55'
              y1='46.16'
              x2='-356.74'
              y2='46.16'
              gradientTransform='translate(-356.74 55.56) rotate(180)'
              gradientUnits='userSpaceOnUse'
            >
              <stop offset='0.53' stopColor='#ec1e24' />
              <stop offset='0.6' stopColor='#ec1e24' stopOpacity='0.99' />
              <stop offset='0.66' stopColor='#ec1e24' stopOpacity='0.94' />
              <stop offset='0.72' stopColor='#ec1e24' stopOpacity='0.87' />
              <stop offset='0.78' stopColor='#ec1e24' stopOpacity='0.76' />
              <stop offset='0.83' stopColor='#ec1e24' stopOpacity='0.63' />
              <stop offset='0.89' stopColor='#ec1e24' stopOpacity='0.46' />
              <stop offset='0.94' stopColor='#ec1e24' stopOpacity='0.27' />
              <stop offset='0.99' stopColor='#ec1e24' stopOpacity='0.04' />
              <stop offset='1' stopColor='#ec1e24' stopOpacity='0' />
            </linearGradient>
            <linearGradient
              id='b'
              x1='137.81'
              y1='46.16'
              x2='275.63'
              y2='46.16'
              gradientTransform='matrix(1, 0, 0, -1, 0, 55.56)'
              xlinkHref='#a'
            />
          </defs>
          <g>
            <motion.path
              fill='none'
              strokeMiterlimit={10}
              strokeWidth={2}
              stroke='url(#a)'
              d='M137.81,1c-15.26,0-29.08,16.8-50,16.8H0'
              {...pathAnimate}
            />
            <motion.path
              fill='none'
              strokeMiterlimit={10}
              strokeWidth={2}
              stroke='url(#b)'
              d='M137.81,1c15.26,0,29.09,16.8,50,16.8h87.82'
              {...pathAnimate}
            />
          </g>
        </motion.svg>
        <motion.div
          className='absolute bottom-0 left-1/2 -translate-x-1/2'
          {...lineAnimate}
        >
          <Image
            src={navIndicatorLineSrc}
            alt='indicator'
            width={99}
            height={2}
            quality={100}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
});

const NavItem = memo(function NavItem({ to, ...moreProps }: NavItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = useMemo(() => pathname === to, [pathname, to]);
  const handleClick = useCallback(() => router.push(to), [to, router]);

  return (
    <div className='relative h-full'>
      <BaseButton
        className={cx(
          'group relative h-full hover:!bg-transparent hover:opacity-100 z-[2]',
          isActive && 'opacity-100',
        )}
        variant='icon'
        ripple={false}
        onClick={handleClick}
        {...moreProps}
      />
      <AnimatePresence>
        {isActive && (
          <motion.div
            className='absolute bottom-[-2px] w-full h-[19px] opacity-0'
            {...indicatorAnimate}
          >
            <NavIndicator />
            <motion.div
              className='absolute w-[54px] h-[32px] left-1/2 bottom-0.5 -translate-x-1/2 z-[1]'
              {...indicatorLightAnimate}
            >
              <Image
                className='animate-pulse'
                src={navIndicatorPulseSrc}
                alt='indicator'
                width={54}
                height={32}
                quality={100}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const CoreNav = memo(function CoreNav() {
  return (
    <nav className='flex justify-center items-center h-full'>
      {mainMenuJson.map(({ to, icon }) => (
        <NavItem key={to} to={to}>
          <BaseIcon
            name={icon as IconName}
            className='dark:fill-current-dark/100'
            width={28}
            height={28}
          />
        </NavItem>
      ))}
    </nav>
  );
});

export default CoreNav;
