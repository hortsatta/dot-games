import { memo, useMemo } from 'react';
import Image from 'next/image';
import { cx } from 'classix';

import carouselDurationTipPng from '#/assets/images/carousel-duration-tip.png';
import carouselThumbnailIndicatorPng from '#/assets/images/carousel-thumbnail-indicator.png';

import type { ComponentProps } from 'react';
import type { CarouselItem } from '#/types/carousel.type';

type Props = ComponentProps<'div'> & {
  items: CarouselItem[];
  currentIndex: number;
  autoplaySpeed?: number;
  autoplayTimeMs?: number;
  onThumbnailSelect?: (index: number) => void;
};

const DURATION_WIDTH = 360;

const ThumbImage = memo(function ThumbImage({
  content,
}: {
  content: CarouselItem['content'];
}) {
  const src = useMemo(
    () =>
      content.type === 'image'
        ? content.image.url
        : content.gameProduct.carouselImageUrl ||
          content.gameProduct.games[0].bgImage,
    [content],
  );

  return (
    <div className='relative w-full h-full'>
      <Image src={src} alt='' className='object-cover' quality={100} fill />
    </div>
  );
});

export const CarouselControl = memo(function CarouselControl({
  className,
  items,
  currentIndex,
  autoplaySpeed,
  autoplayTimeMs,
  onThumbnailSelect,
  ...moreProps
}: Props) {
  const slideDurationWrapperStyle = { width: `${DURATION_WIDTH}px` };

  const slideDurationStyle = useMemo(() => {
    if (!autoplaySpeed || !autoplayTimeMs) {
      return {};
    }

    const speed = autoplaySpeed - 1000;
    const currentLeft = (speed - autoplayTimeMs) / speed;
    const width = (currentLeft * DURATION_WIDTH).toFixed(0).toString() + 'px';

    return { width };
  }, [autoplaySpeed, autoplayTimeMs]);

  return (
    <div
      className={cx(
        'flex flex-col items-center mx-auto py-[54px] px-0 max-w-[400px] w-full',
        className,
      )}
      {...moreProps}
    >
      <div>
        {items.map(({ index, content }) => (
          <button
            key={index}
            aria-label={`go to slide ${index}`}
            className='group relative mx-2.5 w-[75px] h-14 rounded-xl cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.4)] overflow-hidden'
            onClick={() => onThumbnailSelect && onThumbnailSelect(index || 0)}
          >
            <div
              className={cx(
                'absolute top-0 left-0 w-full h-full opacity-0 transition-opacity group-hover:opacity-100 z-10',
                index === currentIndex && 'opacity-100',
              )}
            >
              <Image src={carouselThumbnailIndicatorPng} alt='' quality={100} />
            </div>
            <div
              className={cx(
                'relative w-full h-full transition-all duration-300',
                index === currentIndex ? 'saturate-100' : 'saturate-50',
              )}
            >
              <ThumbImage content={content} />
            </div>
          </button>
        ))}
      </div>
      <div
        style={slideDurationWrapperStyle}
        className='relative mt-5 h-[3px] flex items-center'
      >
        <div
          style={slideDurationStyle}
          className='relative w-full h-full transition-[width] duration-1000 ease-linear bg-gradient-to-r from-[#680a08] to-[#c80907] shadow-[0_1px_0_rgba(0,0,0,0.3),0_0_8px_#892020]'
        />
        <div className='relative h-[3px]'>
          <Image
            src={carouselDurationTipPng}
            alt=''
            className='inline-block absolute max-w-fit top-[-26px] right-[-35px] w-[70px] h-[53px] animate-glitter'
            quality={100}
          />
        </div>
      </div>
    </div>
  );
});

export default CarouselControl;
