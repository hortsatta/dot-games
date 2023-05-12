import { memo, useMemo } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cx } from 'classix';

import type { ComponentProps } from 'react';
import type { CarouselItem } from '#/types/carousel.type';

type Props = ComponentProps<'div'> & {
  currentIndex: number;
  items: CarouselItem[];
};

const animate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const CarouselImageBackdrop = memo(function CarouselImageBackdrop({
  className,
  currentIndex,
  items,
  ...moreProps
}: Props) {
  const imgSrc = useMemo(() => {
    const currentItem = items.find((ci) => ci.index === currentIndex);

    if (!currentItem) {
      return null;
    }

    if (currentItem.content.type === 'image') {
      return currentItem.content.image.url;
    }

    return (
      currentItem.content.gameProduct.carouselImageUrl ||
      currentItem.content.gameProduct.games[0].bgImage
    );
  }, [items, currentIndex]);

  return (
    <div
      className={cx(
        'absolute top-0 left-0 w-full h-[103%] z-0 overflow-hidden',
        className,
      )}
      {...moreProps}
    >
      <AnimatePresence>
        <motion.div key={currentIndex} {...animate}>
          <Image
            src={imgSrc || ''}
            alt='backdrop'
            className='object-cover saturate-[.75] blur'
            fill
            priority
          />
        </motion.div>
      </AnimatePresence>
      <div className='absolute top-0 left-0 w-full h-full z-10 bg-gradient-radial from-transparent to-backdrop to-90%' />
      <div className='absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-t from-backdrop to-transparent to-40%' />
    </div>
  );
});

export default CarouselImageBackdrop;
