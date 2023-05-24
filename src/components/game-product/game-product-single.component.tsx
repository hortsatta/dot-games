'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';
import BaseTypography from '../base/base-typography.component';
import BaseIcon from '../base/base-icon.component';
import GameProductSingleTitle from './game-product-single-header.component';
import GameProductSingleFooter from './game-product-footer.component';

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

  const excerptHtml = useMemo(
    () => ({ __html: gameProducts[0].games[0].description }),
    [gameProducts],
  );

  const esrbRating = useMemo(
    () => gameProducts[0].games[0].esrbRating,
    [gameProducts],
  );

  const isReleased = useMemo(
    () => gameProducts[0].games[0].isReleased,
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
      <GameProductSingleTitle
        className={SECTION_CLASSNAME}
        gameProduct={gameProducts[0]}
      />
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
            quality={100}
          />
        )}
        <div className='flex justify-center items-center'>
          {isReleased && (
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
      <GameProductSingleFooter
        className={SECTION_CLASSNAME}
        gameProduct={gameProducts[0]}
      />
    </div>
  );
});

export default GameProductSingle;
