import { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { cx } from 'classix';

import BaseTag from '../base/base-tag.component';
import BaseDivider from '../base/base-divider.component';
import BaseTypography from '../base/base-typography.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseIcon from '../base/base-icon.component';
import BaseFieldTitle from '../base/base-field-title.component';

import rateStarPng from '#/assets/images/rate-star.png';
import rateStarHalfPng from '#/assets/images/rate-star-half.png';

import type { ComponentProps } from 'react';
import type { GameProduct } from '#/types/game-product.type';

type Props = ComponentProps<'div'> & {
  gameProduct: GameProduct;
  isWishListed?: boolean;
  cartLoading?: boolean;
  wishListLoading?: boolean;
  disabled?: boolean;
  onAddToCart?: () => void;
  onToggleToWishList?: () => void;
};

const ROW_CLASSNAME = 'flex justify-between items-end min-h-[26px]';
const ROW_VALUE_CLASSNAME = 'text-sm leading-none';
const addWishListIconProps = { className: 'fill-deep-purple-400' };

const GameProductCardInfo = memo(function GameProductCardInfo({
  className,
  gameProduct,
  isWishListed,
  cartLoading,
  wishListLoading,
  disabled,
  onAddToCart,
  onToggleToWishList,
}: Props) {
  const platforms = useMemo(
    () =>
      gameProduct.games[0].platforms
        .filter((p) => p.slug.includes('playstation'))
        .map((p) => p.slug),
    [gameProduct],
  );

  const lastPlatformIndex = useMemo(() => platforms.length - 1, [platforms]);

  const finalPrice = useMemo(
    () => gameProduct.finalPrice.toFixed(2),
    [gameProduct],
  );

  const discount = useMemo(() => gameProduct.discount, [gameProduct]);

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

  const genres = useMemo(
    () => gameProduct.games[0].genres.map((g) => g.name).join(', '),
    [gameProduct],
  );

  const releaseDate = useMemo(
    () =>
      dayjs(new Date(gameProduct.games[0].released)).format('MMMM DD, YYYY'),
    [gameProduct],
  );

  const website = useMemo(() => gameProduct.games[0].website, [gameProduct]);

  const esrbRating = useMemo(
    () => gameProduct.games[0].esrbRating,
    [gameProduct],
  );

  return (
    <div
      className={cx(
        'relative -mb-[210px] w-full h-[276px] border-t border-primary/40 group-hover:!mb-0 transition-[margin] duration-500',
        className,
      )}
    >
      <div className='relative px-5 py-2 z-10'>
        <div className='flex justify-between items-center'>
          <div>
            <div className='mb-2.5 flex items-center h-4'>
              {platforms.map((p, index) => (
                <div key={p} className='flex items-center'>
                  <Image
                    src={`/images/plat-${p}.png`}
                    alt={p}
                    className='w-[57px] h-[12px] object-contain'
                    width={57}
                    height={12}
                  />
                  {index < lastPlatformIndex && (
                    <span className='mx-2 leading-none opacity-50'>|</span>
                  )}
                </div>
              ))}
            </div>
            <div className='flex items-center min-h-[24px]'>
              {metaStars.map((_, index) => (
                <Image
                  key={index}
                  src={rateStarPng}
                  alt=''
                  className='object-cover w-6 h-6'
                  width={24}
                  height={24}
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
                  />
                ) : (
                  <Image
                    src={rateStarHalfPng}
                    alt=''
                    className='object-cover w-6 h-6'
                    width={24}
                    height={24}
                  />
                ))}
            </div>
          </div>
          <div className='flex flex-col justify-between items-end font-medium'>
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
        </div>
        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <BaseDivider className='!my-2 opacity-50' />
          <div className={ROW_CLASSNAME}>
            <BaseFieldTitle variant='h5'>Genres</BaseFieldTitle>
            <BaseTypography className={ROW_VALUE_CLASSNAME} variant='paragraph'>
              {genres}
            </BaseTypography>
          </div>
          <BaseDivider className='!mt-0.5 !mb-2 opacity-50' />
          <div className={ROW_CLASSNAME}>
            <BaseFieldTitle variant='h5'>Release Date</BaseFieldTitle>
            <BaseTypography className={ROW_VALUE_CLASSNAME} variant='paragraph'>
              {releaseDate}
            </BaseTypography>
          </div>
          <BaseDivider className='!mt-0.5 !mb-2 opacity-50' />
          <div className={ROW_CLASSNAME}>
            <BaseFieldTitle variant='h5'>Website</BaseFieldTitle>
            <a
              href={website}
              target='_blank'
              className='group/link flex justify-center items-end'
            >
              <BaseTypography
                className={cx(
                  'group-hover/link:!text-blue-300 mb-[1px] mr-1 uppercase font-medium !text-blue-500 !text-[12px]',
                  ROW_VALUE_CLASSNAME,
                )}
                variant='paragraph'
              >
                Official Site
              </BaseTypography>
              <BaseIcon
                name='arrow-square-out'
                className='group-hover/link:!fill-blue-300 fill-blue-500'
                width={18}
                height={18}
                weight='fill'
              />
            </a>
          </div>
          <BaseDivider className='!mt-0.5 !mb-0 opacity-50' />
          <div className='my-1.5 h-6 w-full bg-line-pattern opacity-50' />
          <BaseDivider className='!mt-0 !mb-2 opacity-50' />
          <div className='flex justify-between items-center'>
            <div className='flex items-center'>
              <BaseIconButton
                name='flying-saucer'
                className='mr-2 max-w-none w-14'
                loading={cartLoading}
                disabled={!cartLoading && disabled}
                onClick={onAddToCart}
              />
              <div className='relative'>
                <BaseIconButton
                  name='brain'
                  className='max-w-none w-14'
                  variant='outlined'
                  color='deep-purple'
                  loading={wishListLoading}
                  disabled={!wishListLoading && disabled}
                  iconProps={addWishListIconProps}
                  onClick={onToggleToWishList}
                />
                {isWishListed && (
                  <div className='absolute -top-1.5 -right-1 p-1 bg-green-500 rounded-full'>
                    <BaseIcon
                      name='check-fat'
                      width={12}
                      height={12}
                      weight='fill'
                    />
                  </div>
                )}
              </div>
            </div>
            {!!esrbRating && (
              <Image
                src={`/images/esrb-${esrbRating.slug}.png`}
                alt={esrbRating.name}
                width={30}
                height={40}
              />
            )}
          </div>
        </div>
      </div>
      <div className='absolute top-0 left-0 w-full h-full bg-primary/20 backdrop-blur-lg' />
    </div>
  );
});

export default GameProductCardInfo;
