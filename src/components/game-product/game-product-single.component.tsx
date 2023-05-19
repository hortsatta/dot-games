'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';
import BaseDivider from '../base/base-divider.component';
import BaseTypography from '../base/base-typography.component';
import BaseTag from '../base/base-tag.component';
import BaseFieldTitle from '../base/base-field-title.component';
import BaseIcon from '../base/base-icon.component';
import BaseSurface from '../base/base-surface.component';

import rateStarPng from '#/assets/images/rate-star.png';
import rateStarHalfPng from '#/assets/images/rate-star-half.png';

import type { ComponentProps } from 'react';
import type { GameProduct } from '#/types/game-product.type';
import type { CartItem } from '#/types/cart.type';

type Props = ComponentProps<'div'> & {
  gameProducts: GameProduct[];
  isWishListed?: boolean;
  disabled?: boolean;
  onAddToCart?: (cartItem: CartItem) => Promise<number>;
  onToggleToWishList?: (gameProductId: number) => void;
};

const SECTION_CLASSNAME = 'max-w-[900px] w-full';
const ROW_CLASSNAME = 'text-center';
const ROW_VALUE_CLASSNAME = 'mb-1.5 text-base leading-none';
const ROW_TITLE_CLASSNAME = 'text-sm';

const GameProductSingle = memo(function GameProductSingle({
  className,
  gameProducts,
  isWishListed,
  disabled,
  onAddToCart,
  onToggleToWishList,
  ...moreProps
}: Props) {
  const [cartLoading, setCartLoading] = useState(false);
  const [wishListLoading, setWishListLoading] = useState(false);

  const name = useMemo(() => gameProducts[0].games[0].name, [gameProducts]);

  const developer = useMemo(
    () => gameProducts[0].games[0].developers[0].name,
    [gameProducts],
  );

  const publisher = useMemo(
    () => gameProducts[0].games[0].publishers[0].name,
    [gameProducts],
  );

  const platforms = useMemo(
    () =>
      gameProducts[0].games[0].platforms
        .filter((p) => p.slug.includes('playstation'))
        .map((p) => p.slug),
    [gameProducts],
  );

  const lastPlatformIndex = useMemo(() => platforms.length - 1, [platforms]);

  const metaStars = useMemo(
    () => Array.from(Array(Math.floor(gameProducts[0].games[0].metaScore))),
    [gameProducts],
  );

  const metaLastStar = useMemo(
    () =>
      (gameProducts[0].games[0].metaScore % 1) * 10 >= 5
        ? Math.floor((gameProducts[0].games[0].metaScore % 1) * 10)
        : 0,
    [gameProducts],
  );

  const discount = useMemo(() => gameProducts[0].discount, [gameProducts]);

  const finalPrice = useMemo(
    () => gameProducts[0].finalPrice.toFixed(2),
    [gameProducts],
  );

  const genres = useMemo(
    () => gameProducts[0].games[0].genres.map((g) => g.name).join(', '),
    [gameProducts],
  );

  const releaseDate = useMemo(
    () =>
      dayjs(new Date(gameProducts[0].games[0].released)).format(
        'MMMM DD, YYYY',
      ),
    [gameProducts],
  );

  const website = useMemo(
    () => gameProducts[0].games[0].website,
    [gameProducts],
  );

  const excerptHtml = useMemo(
    () => ({ __html: gameProducts[0].games[0].description }),
    [gameProducts],
  );

  const esrbRating = useMemo(
    () => gameProducts[0].games[0].esrbRating,
    [gameProducts],
  );

  const handleAddToCart = useCallback(async () => {
    try {
      setCartLoading(true);
      onAddToCart &&
        (await onAddToCart({
          gameProductId: gameProducts[0].id,
          quantity: 1,
        }));
    } catch (error) {
      toast.error('Cannot add item to cart, please try again.');
    } finally {
      setCartLoading(false);
    }
  }, [gameProducts, onAddToCart]);

  const handleToggleToWishList = useCallback(async () => {
    console.log('sd');
    try {
      setWishListLoading(true);
      onToggleToWishList && (await onToggleToWishList(gameProducts[0].id));
    } catch (error) {
      toast.error('Cannot add item to wish list, please try again.');
    } finally {
      setWishListLoading(false);
    }
  }, [gameProducts, onToggleToWishList]);

  return (
    <div
      className={cx('relative flex flex-col items-center', className)}
      {...moreProps}
    >
      <div
        className={cx('flex justify-between items-center', SECTION_CLASSNAME)}
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
      </div>
      <div className='pt-10 pb-8 mt-20 mb-24 w-full flex justify-center bg-black/25 border-y border-border/10'>
        <BaseTypography
          dangerouslySetInnerHTML={excerptHtml}
          className='mx-auto max-w-[1000px] w-full description excerpt-shadow w-full m-0 leading-8 !text-current-dark'
          variant='paragraph'
        />
      </div>
      <div
        className={cx(
          'flex items-end w-full mb-8',
          !!esrbRating ? 'justify-between' : 'justify-end',
          SECTION_CLASSNAME,
        )}
      >
        {!!esrbRating && (
          <Image
            src={`/images/esrb-${esrbRating.slug}.png`}
            alt={esrbRating.name}
            width={40}
            height={50}
          />
        )}
        <div className='flex justify-center items-center'>
          {!!onAddToCart && (
            <BaseButton
              aria-label='Add to Cart'
              className='mr-4 flex justify-center items-center w-[220px]  h-[52px]'
              size='lg'
              loading={cartLoading}
              disabled={!cartLoading && disabled}
              onClick={handleAddToCart}
            >
              <BaseIcon
                name='flying-saucer'
                className='ml-1 mr-2'
                width={24}
                height={24}
              />
              Add to Cart
            </BaseButton>
          )}
          {!!onToggleToWishList && (
            <div className='relative'>
              <BaseButton
                aria-label='Add to Wish List'
                className='flex justify-center items-center w-[220px] h-[52px]'
                color='deep-purple'
                size='lg'
                loading={wishListLoading}
                disabled={!wishListLoading && disabled}
                onClick={handleToggleToWishList}
              >
                <BaseIcon
                  name='brain'
                  className='ml-1 mr-2'
                  width={24}
                  height={24}
                />
                Add to Wish List
              </BaseButton>
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
          )}
        </div>
      </div>
      <BaseSurface
        className={cx(
          'py-4 px-24 flex justify-between items-end',
          SECTION_CLASSNAME,
        )}
      >
        <div className={ROW_CLASSNAME}>
          <BaseTypography className={ROW_VALUE_CLASSNAME} variant='paragraph'>
            {genres}
          </BaseTypography>
          <BaseFieldTitle className={ROW_TITLE_CLASSNAME} variant='h3'>
            Genres
          </BaseFieldTitle>
        </div>
        <div className={ROW_CLASSNAME}>
          <BaseTypography className={ROW_VALUE_CLASSNAME} variant='paragraph'>
            {releaseDate}
          </BaseTypography>
          <BaseFieldTitle className={ROW_TITLE_CLASSNAME} variant='h3'>
            Release Date
          </BaseFieldTitle>
        </div>
        <div className={ROW_CLASSNAME}>
          <a
            href={website}
            target='_blank'
            className='group/link flex justify-center items-end'
          >
            <BaseTypography
              className='group-hover/link:!text-blue-300 mb-[1px] mr-1 uppercase font-medium !text-blue-500 text-base leading-none'
              variant='paragraph'
            >
              Official Site
            </BaseTypography>
            <BaseIcon
              name='arrow-square-out'
              className='group-hover/link:!fill-blue-300 fill-blue-500'
              width={22}
              height={22}
              weight='fill'
            />
          </a>
          <BaseFieldTitle className={ROW_TITLE_CLASSNAME} variant='h3'>
            Website
          </BaseFieldTitle>
        </div>
      </BaseSurface>
    </div>
  );
});

export default GameProductSingle;
