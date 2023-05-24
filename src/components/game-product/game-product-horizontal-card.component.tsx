'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { cx } from 'classix';

import GameProductHorizontalCardInfo from './game-product-horizontal-card-info.component';

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

const GameProductHorizontalCard = memo(function GameProductHorizontalCard({
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
          'relative w-[704px] h-[411px] rounded-2xl overflow-hidden z-10 shadow-[0_2px_6px_rgba(0,0,0,0.3)]',
          className,
        )}
        {...moreProps}
      >
        <GameProductHorizontalCardInfo
          className='relative mt-[73px] group-hover:mt-0 transition-[margin] duration-300'
          gameProduct={gameProduct}
          isWishListed={isWishListed}
          cartLoading={cartLoading}
          wishListLoading={wishListLoading}
          disabled={disabled}
          onAddToCart={handleAddToCart}
          onToggleToWishList={handleToggleToWishList}
        />
        <div className='absolute top-0 left-0 w-full h-full bg-backdrop'>
          <div
            style={backdropStyle}
            className={
              'w-full h-full bg-cover bg-no-repeat opacity-100 scale-100 translate-y-0 transition-all ease-linear duration-[20000ms]' +
              ' group-hover:!scale-125 group-hover:!opacity-70 group-hover:!-translate-y-8'
            }
          />
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent to-60% z-[1]' />
        </div>
      </article>
      <div className='group-hover:opacity-100 opacity-0 absolute w-full h-full top-0 left-0 bg-gradient-to-t from-primary to-transparent to-70% transition-opacity rounded-2xl overflow-hidden' />
    </div>
  );
});

export default GameProductHorizontalCard;
