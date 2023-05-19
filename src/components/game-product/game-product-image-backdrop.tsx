import { memo } from 'react';
import Image from 'next/image';
import { cx } from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  src: string;
};

const GameProductImageBackdrop = memo(function GameProductImageBackdrop({
  className,
  src,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'absolute top-0 left-0 w-full h-full z-0 overflow-hidden',
        className,
      )}
      {...moreProps}
    >
      <Image
        src={src}
        alt='backdrop'
        className='object-cover object-top blur opacity-70'
        fill
        priority
      />
      <div className='absolute top-0 left-0 w-full h-full z-10 bg-gradient-radial from-transparent to-backdrop to-90%' />
      <div className='absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-t from-backdrop to-transparent to-40%' />
    </div>
  );
});

export default GameProductImageBackdrop;
