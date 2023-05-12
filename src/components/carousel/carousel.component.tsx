'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
import { cx } from 'classix';

import CarouselControl from './carousel-control.component';
import CarouselItem from './carousel-item.component';

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
  onAddToFavorites?: (gameProduct: GameProduct) => void;
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
  onAddToFavorites,
  ...moreProps
}: Props) {
  const {
    seconds: autoplaySeconds,
    isRunning: isAutoplayRunning,
    ...autoplayActions
  } = useStopwatch({ autoStart: false });

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
      if (!autoplay || !isAutoplayRunning || index !== currentIndex) {
        return;
      }
      autoplayActions.pause();
    },
    [autoplay, isAutoplayRunning, autoplayActions, currentIndex],
  );

  const handleItemMouseLeave = useCallback(
    (index?: number) => {
      if (!autoplay || !isAutoplayRunning || index !== currentIndex) {
        return;
      }
      autoplayActions.start();
    },
    [autoplay, isAutoplayRunning, autoplayActions, currentIndex],
  );

  const handleAddToCart = useCallback(
    (item: CarouselItemType) => {
      item.content.type === 'game' &&
        onAddToCart &&
        onAddToCart(item.content.gameProduct);
    },
    [onAddToCart],
  );

  const handleAddToFavorites = useCallback(
    (item: CarouselItemType) => {
      item.content.type === 'game' &&
        onAddToFavorites &&
        onAddToFavorites(item.content.gameProduct);
    },
    [onAddToFavorites],
  );

  return (
    <div className={cx('mx-auto w-full', className)} {...moreProps}>
      <CarouselControl
        items={items}
        currentIndex={currentIndex}
        autoplaySpeed={autoplaySpeed}
        autoplayTimeMs={autoplaySeconds * 1000}
        onThumbnailSelect={handleThumbnailSelect}
      />
      <div ref={ref} className='relative pt-2.5 pb-8 w-full overflow-hidden'>
        <div
          style={itemWrapperStyle}
          className={cx(
            'relative flex items-center transition-transform',
            !hasTransition && '!transition-none',
          )}
        >
          {carouselItems.map((item) => (
            <CarouselItem
              {...(item.index === 0 && { ref: itemRef })}
              key={item.index}
              className={cx(
                item.index === currentIndex
                  ? '!saturate-100 !brightness-100'
                  : 'cursor-pointer hover:!brightness-100',
                itemClassName,
              )}
              item={item}
              onAddToCart={() => handleAddToCart(item)}
              onAddToFavorites={() => handleAddToFavorites(item)}
              onMouseEnter={() => handleItemMouseEnter(item.index)}
              onMouseLeave={() => handleItemMouseLeave(item.index)}
              onClick={() => goToSlide(item.index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Carousel;
