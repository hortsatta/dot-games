import { memo, useMemo } from 'react';
import cx from 'classix';
import Image from 'next/image';

import BaseDivider from '../base/base-divider.component';
import BaseTag from '../base/base-tag.component';
import BaseTypography from '../base/base-typography.component';

import rateStarPng from '#/assets/images/rate-star.png';
import rateStarHalfPng from '#/assets/images/rate-star-half.png';

import type { ComponentProps } from 'react';
import type { GameProduct } from '#/types/game-product.type';

type Props = ComponentProps<'div'> & {
  gameProduct: GameProduct;
};

const GameProductSingleHeader = memo(function GameProductSingleHeader({
  className,
  gameProduct,
  ...moreProps
}: Props) {
  const name = useMemo(() => gameProduct.games[0].name, [gameProduct]);

  const developer = useMemo(
    () => gameProduct.games[0].developers[0].name,
    [gameProduct],
  );

  const publisher = useMemo(
    () => gameProduct.games[0].publishers[0].name,
    [gameProduct],
  );

  const platforms = useMemo(
    () =>
      gameProduct.games[0].platforms
        .filter((p) => p.slug.includes('playstation'))
        .map((p) => p.slug),
    [gameProduct],
  );

  const lastPlatformIndex = useMemo(() => platforms.length - 1, [platforms]);

  const metaStars = useMemo(
    () => Array.from(Array(Math.floor(gameProduct.games[0].metaScore))),
    [gameProduct],
  );

  const metaLastStar = useMemo(
    () =>
      (gameProduct.games[0].metaScore % 1) * 10 >= 5
        ? Math.floor((gameProduct.games[0].metaScore % 1) * 10)
        : 0,
    [gameProduct],
  );

  const discount = useMemo(() => gameProduct.discount, [gameProduct]);

  const finalPrice = useMemo(
    () => gameProduct.finalPrice.toFixed(2),
    [gameProduct],
  );

  return (
    <div
      className={cx('flex justify-between items-center', className)}
      {...moreProps}
    >
      <div className='w-[140px] flex flex-col justify-between items-end font-medium'>
        {!!discount && (
          <BaseTag className='mb-1.5 !pt-1.5 !pb-0.5 text-xs'>
            {discount}% off
          </BaseTag>
        )}
        <span className='flex items-start text-[26px] leading-none'>
          <span className='text-sm'>$</span>
          {finalPrice}
        </span>
      </div>
      <BaseDivider className='!h-16' isHorizontal />
      <div>
        <BaseTypography
          className='block mb-2 text-3xl text-center'
          variant='h1'
        >
          {name}
        </BaseTypography>
        <span className='block text-sm text-center text-current-dark/70'>
          {developer}
          <span className='inline-block mx-2'>/</span>
          {publisher}
        </span>
      </div>
      <BaseDivider className='!h-16' isHorizontal />
      <div className='w-[140px]'>
        <div className='mb-2.5 flex items-center h-4'>
          {platforms.map((p, index) => (
            <div key={p} className='flex items-center'>
              <Image
                src={`/images/plat-${p}.png`}
                alt={p}
                className='w-[57px] h-[12px] object-contain'
                width={57}
                height={12}
                quality={100}
              />
              {index < lastPlatformIndex && (
                <span className='mx-2 leading-none opacity-50'>|</span>
              )}
            </div>
          ))}
        </div>
        {!!metaStars?.length && (
          <div className='flex items-center min-h-[24px]'>
            {metaStars.map((_, index) => (
              <Image
                key={index}
                src={rateStarPng}
                alt=''
                className='object-cover w-6 h-6'
                width={24}
                height={24}
                quality={100}
              />
            ))}
            {!!metaLastStar &&
              (metaLastStar > 8 ? (
                <Image
                  src={rateStarPng}
                  alt=''
                  className='object-cover w-6 h-6'
                  width={24}
                  height={24}
                  quality={100}
                />
              ) : (
                <Image
                  src={rateStarHalfPng}
                  alt=''
                  className='object-cover w-6 h-6'
                  width={24}
                  height={24}
                  quality={100}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default GameProductSingleHeader;
