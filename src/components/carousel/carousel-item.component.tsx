'use client';

import { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import striptags from 'striptags';
import toast from 'react-hot-toast';
import { Tooltip } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseTypography from '../base/base-typography.component';
import BaseIcon from '../base/base-icon.component';
import BaseButton from '../base/base-button.component';
import BaseIconButton from '../base/base-icon-button.component';
import CarouselGameProductPrice from './carousel-game-product-price.component';

import type { ComponentProps } from 'react';
import type { CarouselItem as CarouselItemType } from '#/types/carousel.type';
import type { CartItem } from '#/types/cart.type';

type Props = ComponentProps<'div'> & {
  item: CarouselItemType;
  isWishListed?: boolean;
  disabled?: boolean;
  onAddToCart?: (cartItem: CartItem) => Promise<number>;
  onToggleToWishList?: (gameProductId: number) => void;
};

type ContentProps = {
  content: CarouselItemType['content'];
  isWishListed?: boolean;
  disabled?: boolean;
  onAddToCart?: (cartItem: CartItem) => Promise<number>;
  onToggleToWishList?: (gameProductId: number) => void;
};

const Content = memo(function Content({
  content,
  isWishListed,
  disabled,
  onAddToCart,
  onToggleToWishList,
}: ContentProps) {
  const [cartLoading, setCartLoading] = useState(false);
  const [wishListLoading, setWishListLoading] = useState(false);
  const isImageType = useMemo(() => content.type === 'image', [content]);

  const href = useMemo(
    () =>
      content.type === 'game'
        ? `/games/${content.gameProduct.games[0].slug}`
        : '',
    [content],
  );

  const name = useMemo(
    () => (content.type === 'game' ? content.gameProduct.games[0].name : ''),
    [content],
  );

  const excerptHtml = useMemo(() => {
    const htmlString =
      content.type === 'game'
        ? content.excerpt || content.gameProduct.games[0].description
        : '';
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
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
  }, [content]);

  const price = useMemo(
    () => (content.type === 'game' ? content.gameProduct.price : 0),
    [content],
  );

  const finalPrice = useMemo(
    () => (content.type === 'game' ? content.gameProduct.finalPrice : 0),
    [content],
  );

  const discount = useMemo(
    () => (content.type === 'game' ? content.gameProduct.discount : 0),
    [content],
  );

  const handleAddToCart = useCallback(async () => {
    if (content.type !== 'game') {
      return;
    }

    try {
      setCartLoading(true);
      onAddToCart &&
        (await onAddToCart({
          gameProductId: content.gameProduct.id,
          quantity: 1,
        }));
    } catch (error) {
      toast.error('Cannot add item to cart, please try again.');
    } finally {
      setCartLoading(false);
    }
  }, [content, onAddToCart]);

  const handleToggleToWishList = useCallback(async () => {
    if (content.type !== 'game') {
      return;
    }

    try {
      setWishListLoading(true);
      onToggleToWishList && (await onToggleToWishList(content.gameProduct.id));
    } catch (error) {
      toast.error('Cannot add item to wish list, please try again.');
    } finally {
      setWishListLoading(false);
    }
  }, [content, onToggleToWishList]);

  return (
    <div
      className={
        'relative flex flex-col justify-end px-10 pt-4 pb-8 max-w-[unset] w-full h-full' +
        " before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-gradient-to-t before:from-black/80 before:via-white/0 before:to-white/0"
      }
    >
      {isImageType ? (
        <></>
      ) : (
        <div className='relative flex justify-between items-end w-full'>
          <div className='relative flex-1 pr-8'>
            <Link href={href} prefetch={false}>
              <BaseTypography
                className='mb-3 text-4xl font-bold leading-tight hover:underline !text-white'
                variant='h4'
              >
                {name}
              </BaseTypography>
            </Link>
            <BaseTypography
              dangerouslySetInnerHTML={excerptHtml}
              className='excerpt-shadow line-clamp-3 w-full m-0 leading-normal !text-white text-ellipsis'
              variant='paragraph'
            />
          </div>
          <div className='relative flex flex-col items-end shrink-0'>
            <CarouselGameProductPrice
              className='mb-1.5 w-full'
              price={price}
              finalPrice={finalPrice}
              discount={discount}
            />
            <div className='flex items-center w-[198px]' color='red'>
              <BaseButton
                aria-label='buy now'
                className='p-0 flex justify-center items-center flex-1 shrink-0 basis-[150px] text-base leading-none rounded-r-none'
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
                Buy Now
              </BaseButton>
              <div className='relative shrink-0'>
                <Tooltip content='add to wish list'>
                  <BaseIconButton
                    aria-label='add to wish list'
                    name='brain'
                    className='rounded-l-none'
                    color='deep-purple'
                    size='lg'
                    loading={wishListLoading}
                    disabled={!wishListLoading && disabled}
                    onClick={handleToggleToWishList}
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
          </div>
        </div>
      )}
    </div>
  );
});

const CarouselItem = memo(
  forwardRef<HTMLDivElement, Props>(function CarouselItem(
    {
      className,
      item: { content },
      isWishListed,
      disabled,
      onAddToCart,
      onToggleToWishList,
      ...moreProps
    },
    ref,
  ) {
    const src = useMemo(
      () =>
        content.type === 'image'
          ? content.image.url
          : content.gameProduct.carouselImageUrl ||
            content.gameProduct.games[0].bgImage,
      [content],
    );

    const alt = useMemo(
      () =>
        content.type === 'image'
          ? content.image.name || ''
          : content.gameProduct.games[0].name,
      [content],
    );

    return (
      <div
        ref={ref}
        className={cx(
          'relative shrink-0 mx-[45px] w-full rounded-3xl shadow-[0_4px_8px_rgba(0,0,0,0.4)] opacity-70' +
            ' overflow-hidden transition-all duration-500 aspect-[16/10]',
          className,
        )}
        {...moreProps}
      >
        <div className='absolute top-0 bottom-0 left-0 right-0'>
          <div className='absolute top-0 left-0 w-full h-full'>
            <Image
              src={src}
              alt={alt}
              className='object-cover'
              quality={100}
              fill
            />
          </div>
          <Content
            content={content}
            isWishListed={isWishListed}
            disabled={disabled}
            onAddToCart={onAddToCart}
            onToggleToWishList={onToggleToWishList}
          />
        </div>
      </div>
    );
  }),
);

export default CarouselItem;
