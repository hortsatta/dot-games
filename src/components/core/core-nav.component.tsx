'use client';

import { useCallback, useMemo } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';
import BaseIcon from '../base/base-icon.component';

import navIndicatorSrc from '#/assets/images/nav-indicator.png';
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

const NavIndicator = () => (
  <div className='absolute left-1/2 bottom-0 w-[276px] h-full translate-x-[-50%]'>
    <motion.svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 276 19'>
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
        <linearGradient
          id='c'
          x1='88.31'
          y1='17.8'
          x2='187.31'
          y2='17.8'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0' stopColor='#ec1e24' stopOpacity='0' />
          <stop offset='0.05' stopColor='#ec1e24' stopOpacity='0.22' />
          <stop offset='0.11' stopColor='#ec1e24' stopOpacity='0.42' />
          <stop offset='0.18' stopColor='#ec1e24' stopOpacity='0.6' />
          <stop offset='0.24' stopColor='#ec1e24' stopOpacity='0.74' />
          <stop offset='0.3' stopColor='#ec1e24' stopOpacity='0.86' />
          <stop offset='0.37' stopColor='#ec1e24' stopOpacity='0.94' />
          <stop offset='0.43' stopColor='#ec1e24' stopOpacity='0.98' />
          <stop offset='0.5' stopColor='#ec1e24' />
          <stop offset='0.55' stopColor='#ec1e24' stopOpacity='0.98' />
          <stop offset='0.62' stopColor='#ec1e24' stopOpacity='0.91' />
          <stop offset='0.69' stopColor='#ec1e24' stopOpacity='0.8' />
          <stop offset='0.77' stopColor='#ec1e24' stopOpacity='0.65' />
          <stop offset='0.85' stopColor='#ec1e24' stopOpacity='0.45' />
          <stop offset='0.93' stopColor='#ec1e24' stopOpacity='0.21' />
          <stop offset='1' stopColor='#ec1e24' stopOpacity='0' />
        </linearGradient>
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
        <motion.line
          fill='none'
          strokeMiterlimit={10}
          strokeWidth={2}
          opacity={0.6}
          stroke='url(#c)'
          x1='88.31'
          y1='17.8'
          x2='187.31'
          y2='17.8'
          {...lineAnimate}
        />
      </g>
    </motion.svg>
  </div>
);

const NavItem = ({ to, ...moreProps }: NavItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = useMemo(() => pathname === to, [pathname, to]);
  const handleClick = useCallback(() => router.push(to), [to, router]);

  return (
    <div className='relative h-full'>
      <BaseButton
        className={cx(
          'group relative h-full hover:!bg-transparent hover:opacity-100 z-[2]',
          !isActive && 'opacity-80',
        )}
        variant='text'
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
              className='absolute w-[54px] h-[32px] left-1/2 bottom-0.5 translate-x-[-50%] z-[1]'
              {...indicatorLightAnimate}
            >
              <Image
                className='animate-pulse'
                src={navIndicatorSrc}
                alt='indicator'
                width={54}
                height={32}
                quality={100}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CoreNav = () => (
  <nav className='flex justify-center items-center h-full'>
    {mainMenuJson.map(({ to, icon }) => (
      <NavItem key={to} to={to}>
        <BaseIcon name={icon as IconName} width={28} height={28} fill='white' />
      </NavItem>
    ))}
  </nav>
);

export default CoreNav;
