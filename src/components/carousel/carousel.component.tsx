'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useStopwatch } from 'react-timer-hook';
import { cx } from 'classix';

import CarouselImageBackdrop from './carousel-image-backdrop.component';
import CarouselControl from './carousel-control.component';
import CarouselItem from './carousel-item.component';

import carouselEndGradientPng from '#/assets/images/carousel-end-gradient.png';

import type { ComponentProps } from 'react';
import type { CarouselItem as CarouselItemType } from '#/types/carousel.type';
import type { GameProduct } from '#/types/game-product.type';

type Props = ComponentProps<'div'> & {
  items: CarouselItemType[];
  itemOffsetLength?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  itemClassName?: string;
  onAddToCart?: (gameProduct: GameProduct) => void;
  onAddToWishList?: (gameProduct: GameProduct) => void;
};

const getNumber = (value: string) => Number(value.replace(/[^0-9.]/g, ''));

const Carousel = memo(function Carousel({
  className,
  items,
  itemOffsetLength = 2,
  autoplay = true,
  autoplaySpeed = 6000,
  itemClassName,
  onAddToCart,
  onAddToWishList,
  ...moreProps
}: Props) {
  const { seconds: autoplaySeconds, ...autoplayActions } = useStopwatch({
    autoStart: false,
  });

  const ref = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [itemSize, setItemSize] = useState({ width: 0, offset: 0 });
  const [hasTransition, setHasTransition] = useState(true);

  useEffect(() => {
    if (!itemRef.current || !ref.current) {
      return;
    }

    // Get and set carousel item size and offset base on parent width
    const carouselStyles = window.getComputedStyle(ref.current);
    const itemStyles = window.getComputedStyle(itemRef.current);
    const carouselItemWidth =
      getNumber(itemStyles.width) +
      getNumber(itemStyles.marginLeft) +
      getNumber(itemStyles.marginRight);
    const offset = (getNumber(carouselStyles.width) - carouselItemWidth) / 2;

    setItemSize({ width: carouselItemWidth, offset });

    // Initialise autoplay if true
    if (!autoplay) {
      return;
    }
    autoplayActions.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  // Check current index and adjust value if outside of item count
  useEffect(() => {
    if (!items.length) {
      return;
    }

    if (currentIndex >= items.length) {
      setCurrentIndex(() => {
        setHasTransition(true);
        return items.length - 1;
      });
    }

    if (currentIndex < 0) {
      setCurrentIndex(() => {
        setHasTransition(true);
        return 0;
      });
    }
  }, [currentIndex, items]);

  const offsetLength: number = useMemo(() => {
    const length = items.length - 1;
    return Math.min(length, itemOffsetLength);
  }, [items, itemOffsetLength]);

  // Clone before and after items and merge them to the main items for infinite loop
  const carouselItems = useMemo(() => {
    const beforeItems = [...items].splice(
      items.length - offsetLength,
      offsetLength,
    );
    const afterItems = [...items].splice(0, offsetLength);

    return [
      ...beforeItems.map((item, i) => ({
        ...item,
        index: -(beforeItems.length - i),
      })),
      ...items,
      ...afterItems.map((item, i) => ({
        ...item,
        index: items.length + i,
      })),
    ];
  }, [offsetLength, items]);

  const itemWrapperStyle = useMemo(() => {
    const x = itemSize.width * (currentIndex + offsetLength) - itemSize.offset;
    return { transform: `translateX(-${x}px)` };
  }, [itemSize, offsetLength, currentIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      autoplay && autoplayActions.reset();
      setCurrentIndex(() => {
        if (index >= items.length) {
          setHasTransition(false);
          return -1;
        }

        if (index < 0) {
          setHasTransition(false);
          return items.length;
        }

        setHasTransition(true);
        return index;
      });
    },
    [autoplay, autoplayActions, items],
  );

  useEffect(() => {
    if (autoplaySeconds * 1000 < autoplaySpeed) {
      return;
    }
    goToSlide(currentIndex + 1);
  }, [
    currentIndex,
    autoplaySeconds,
    autoplaySpeed,
    autoplayActions,
    goToSlide,
  ]);

  const handleThumbnailSelect = useCallback(
    (index: number) => goToSlide(index),
    [goToSlide],
  );

  const handleItemMouseEnter = useCallback(
    (index?: number) => {
      if (!autoplay || index !== currentIndex) {
        return;
      }
      autoplayActions.pause();
    },
    [autoplay, autoplayActions, currentIndex],
  );

  const handleItemMouseLeave = useCallback(
    (index?: number) => {
      if (!autoplay || index !== currentIndex) {
        return;
      }
      autoplayActions.start();
    },
    [autoplay, autoplayActions, currentIndex],
  );

  const handleAddToCart = useCallback(
    (item: CarouselItemType) => {
      item.content.type === 'game' &&
        onAddToCart &&
        onAddToCart(item.content.gameProduct);
    },
    [onAddToCart],
  );

  const handleAddToWishList = useCallback(
    (item: CarouselItemType) => {
      item.content.type === 'game' &&
        onAddToWishList &&
        onAddToWishList(item.content.gameProduct);
    },
    [onAddToWishList],
  );

  return (
    <div
      className={cx(
        'relative pt-[72px] mx-auto w-full overflow-hidden',
        className,
      )}
      {...moreProps}
    >
      <CarouselImageBackdrop
        currentIndex={currentIndex}
        items={carouselItems}
      />
      <CarouselControl
        items={items}
        currentIndex={currentIndex}
        autoplaySpeed={autoplaySpeed}
        autoplayTimeMs={autoplaySeconds * 1000}
        onThumbnailSelect={handleThumbnailSelect}
      />
      <div
        ref={ref}
        className='relative pt-2.5 pb-8 mx-auto w-full overflow-hidden'
      >
        <div
          style={itemWrapperStyle}
          className={cx(
            'relative flex items-center transition-transform duration-1000',
            !hasTransition && '!transition-none',
          )}
        >
          {carouselItems.map((item) => (
            <CarouselItem
              {...(item.index === 0 && { ref: itemRef })}
              key={item.index}
              className={cx(
                item.index === currentIndex
                  ? '!saturate-100 !opacity-100'
                  : 'cursor-pointer hover:!opacity-100',
                itemClassName,
              )}
              item={item}
              onAddToCart={() => handleAddToCart(item)}
              onAddToWishList={() => handleAddToWishList(item)}
              onMouseEnter={() => handleItemMouseEnter(item.index)}
              onMouseLeave={() => handleItemMouseLeave(item.index)}
              onClick={() => goToSlide(item.index)}
            />
          ))}
        </div>
        <div className='absolute pt-2.5 pb-8 left-0 top-0 w-32 h-full z-10 overflow-hidden'>
          <Image
            src={carouselEndGradientPng}
            alt=''
            className='w-full h-full'
          />
        </div>
        <div className='absolute pt-2.5 pb-8 right-0 top-0 w-32 h-full z-10 overflow-hidden'>
          <Image
            src={carouselEndGradientPng}
            alt=''
            className='w-full h-full -scale-100'
          />
        </div>
      </div>
    </div>
  );
});

export default Carousel;
