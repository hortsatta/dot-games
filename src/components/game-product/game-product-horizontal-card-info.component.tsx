import { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import striptags from 'striptags';
import { Tooltip } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseDivider from '../base/base-divider.component';
import BaseTag from '../base/base-tag.component';
import BaseTypography from '../base/base-typography.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseIcon from '../base/base-icon.component';

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

const addWishListIconProps = { className: 'fill-deep-purple-400' };

const GameProductHorizontalCardInfo = memo(
  function GameProductHorizontalCardInfo({
    className,
    gameProduct,
    isWishListed,
    cartLoading,
    wishListLoading,
    disabled,
    onAddToCart,
    onToggleToWishList,
  }: Props) {
    const href = useMemo(
      () => `/games/${gameProduct.games[0].slug}`,
      [gameProduct],
    );

    const name = useMemo(() => gameProduct.games[0].name, [gameProduct]);

    const developer = useMemo(
      () => gameProduct.games[0].publishers[0].name,
      [gameProduct],
    );

    const publisher = useMemo(
      () => gameProduct.games[0].developers[0].name,
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

    const finalPrice = useMemo(
      () => gameProduct.finalPrice.toFixed(2),
      [gameProduct],
    );

    const discount = useMemo(() => gameProduct.discount, [gameProduct]);

    const isReleased = useMemo(
      () => gameProduct.games[0].isReleased,
      [gameProduct],
    );

    const excerptHtml = useMemo(() => {
      const doc = new DOMParser().parseFromString(
        gameProduct.games[0].description,
        'text/html',
      );
      const first = striptags(
        [...doc.body.children].map((el) => el.outerHTML)[0],
      );

      const sentences = first
        .replace(/\.\s+/g, '.|')
        .replace(/\?\s/g, '?|')
        .replace(/\!\s/g, '!|')
        .split('|');

      const __html =
        sentences.slice(0, 2).join(' ').length <= 225
          ? sentences.slice(0, 2).join(' ')
          : sentences.slice(0, 1).join(' ');

      return { __html };
    }, [gameProduct]);

    return (
      <div
        className={cx(
          'relative flex flex-col justify-end w-full h-full z-10',
          className,
        )}
      >
        <div className='flex justify-between items-end px-8 pb-4'>
          <div>
            <Link href={href} className='inline-block hover:underline'>
              <BaseTypography className='leading-none' variant='h4'>
                {name}
              </BaseTypography>
            </Link>
            <div className='flex pt-1.5'>
              <span className='text-xs leading-none'>
                {publisher}
                <span className='mx-1'> / </span>
                {developer}
              </span>
            </div>
          </div>
          <div className='flex flex-col justify-between items-end font-medium'>
            <BaseTag className='mb-1.5 !pt-1.5 !pb-0.5 text-xs'>
              {discount}% off
            </BaseTag>
            <span className='flex items-start text-[26px] leading-none'>
              <span className='text-sm'>$</span>
              {finalPrice}
            </span>
          </div>
        </div>
        <div className='relative w-full bg-secondary/20 backdrop-blur-lg border-t border-secondary/40'>
          <div className='relative px-8 py-4 z-10 h-[112px]'>
            <BaseTypography
              dangerouslySetInnerHTML={excerptHtml}
              className='excerpt-shadow line-clamp-3 w-full m-0 leading-normal !text-white text-ellipsis'
              variant='paragraph'
            />
          </div>
          <div className='opacity-0 group-hover:opacity-100 transition-opacity px-8 pb-4'>
            <BaseDivider className='!my-0 opacity-50' />
            <div className='flex justify-between items-center pt-4'>
              <div className='flex items-center'>
                {isReleased && (
                  <Tooltip content='add to cart'>
                    <BaseIconButton
                      name='flying-saucer'
                      aria-label='add to cart'
                      className='mr-2 max-w-none w-14'
                      loading={cartLoading}
                      disabled={!cartLoading && disabled}
                      onClick={onAddToCart}
                    />
                  </Tooltip>
                )}
                <div className='relative'>
                  <Tooltip content='add to wish list'>
                    <BaseIconButton
                      name='brain'
                      aria-label='add to wish list'
                      className='max-w-none w-14'
                      variant='outlined'
                      color='deep-purple'
                      loading={wishListLoading}
                      disabled={!wishListLoading && disabled}
                      iconProps={addWishListIconProps}
                      onClick={onToggleToWishList}
                    />
                  </Tooltip>
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
              <div className='flex items-center'>
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
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default GameProductHorizontalCardInfo;
