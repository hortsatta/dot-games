'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { cx } from 'classix';

import BaseTypography from '../base/base-typography.component';
import GameProductCardInfo from './game-product-card-info.component';

import type { ComponentProps } from 'react';
import type { GameProduct } from '#/types/game-product.type';
import type { CartItem } from '#/types/cart.type';

type Props = ComponentProps<'article'> & {
  gameProduct: GameProduct;
  isWishListed?: boolean;
  disabled?: boolean;
  onAddToCart?: (cartItem: CartItem) => Promise<number>;
  onToggleToWishList?: (gameProductId: number) => void;
};

const GameProductCard = memo(function GameProductCard({
  className,
  gameProduct,
  isWishListed,
  disabled,
  onAddToCart,
  onToggleToWishList,
  ...moreProps
}: Props) {
  const [cartLoading, setCartLoading] = useState(false);
  const [wishListLoading, setWishListLoading] = useState(false);

  const backdropSrc = useMemo(
    () => gameProduct.games[0].bgImage,
    [gameProduct],
  );

  const name = useMemo(() => gameProduct.games[0].name, [gameProduct]);

  const href = useMemo(
    () => `/games/${gameProduct.games[0].slug}`,
    [gameProduct],
  );

  const developer = useMemo(
    () => gameProduct.games[0].publishers[0].name,
    [gameProduct],
  );

  const publisher = useMemo(
    () => gameProduct.games[0].developers[0].name,
    [gameProduct],
  );

  const backdropStyle = useMemo(
    () => ({
      backgroundImage: `url('${backdropSrc}')`,
      backgroundPositionX: !!gameProduct.games[0].bgImageOffsetPosX
        ? `${gameProduct.games[0].bgImageOffsetPosX}%`
        : '50%',
    }),
    [gameProduct, backdropSrc],
  );

  const handleAddToCart = useCallback(async () => {
    try {
      setCartLoading(true);
      onAddToCart &&
        (await onAddToCart({
          gameProductId: gameProduct.id,
          quantity: 1,
        }));
    } catch (error) {
      toast.error('Cannot add item to cart, please try again.');
    } finally {
      setCartLoading(false);
    }
  }, [gameProduct, onAddToCart]);

  const handleToggleToWishList = useCallback(async () => {
    try {
      setWishListLoading(true);
      onToggleToWishList && (await onToggleToWishList(gameProduct.id));
    } catch (error) {
      toast.error('Cannot add item to wish list, please try again.');
    } finally {
      setWishListLoading(false);
    }
  }, [gameProduct, onToggleToWishList]);

  return (
    <div className='group relative w-fit p-0.5'>
      <article
        className={cx(
          'relative w-[344px] h-[550px] rounded-2xl overflow-hidden z-10 shadow-[0_2px_6px_rgba(0,0,0,0.3)]',
          className,
        )}
        {...moreProps}
      >
        <div className='relative flex flex-col justify-end w-full h-full z-10 group-hover:mt-0 mt-[210px] transition-[margin] duration-500'>
          <div className='px-5 pb-2'>
            <Link
              href={href}
              className='inline-block hover:underline translate-y-6 group-hover:translate-y-0 transition-[transform] duration-300 delay-500'
            >
              <BaseTypography className='leading-none' variant='h4'>
                {name}
              </BaseTypography>
            </Link>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-500'>
              <span className='text-xs leading-none'>
                {publisher}
                <span className='mx-1'> / </span>
                {developer}
              </span>
            </div>
          </div>
          <GameProductCardInfo
            gameProduct={gameProduct}
            isWishListed={isWishListed}
            cartLoading={cartLoading}
            wishListLoading={wishListLoading}
            disabled={disabled}
            onAddToCart={handleAddToCart}
            onToggleToWishList={handleToggleToWishList}
          />
        </div>
        <div className='absolute top-0 left-0 w-full h-full bg-backdrop'>
          <div
            style={backdropStyle}
            className={
              'w-full h-full bg-cover bg-no-repeat opacity-100 scale-100 translate-y-0 transition-all ease-linear duration-[20000ms]' +
              ' group-hover:!scale-125 group-hover:!opacity-70 group-hover:!-translate-y-8'
            }
          />
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent to-60% z-[1]' />
        </div>
      </article>
      <div className='group-hover:opacity-100 opacity-0 absolute w-full h-full top-0 left-0 bg-gradient-to-t from-primary to-transparent to-70% transition-opacity rounded-2xl overflow-hidden' />
    </div>
  );
});

export default GameProductCard;
