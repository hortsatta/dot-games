import { memo, useMemo } from 'react';
import Image from 'next/image';
import { cx } from 'classix';

import BaseTypography from '../base/base-typography.component';
import GameProductCardInfo from './game-product-card-info.component';

import gpBorderPng from '#/assets/images/gp-border.png';

import type { ComponentProps } from 'react';
import type { GameProduct } from '#/types/game-product.type';

type Props = ComponentProps<'article'> & {
  gameProduct: GameProduct;
  loading?: boolean;
  onAddToCart?: (gameProduct: GameProduct) => void;
  onAddToFavorites?: (gameProduct: GameProduct) => void;
};

const GameProductCard = memo(function GameProductCard({
  className,
  gameProduct,
}: Props) {
  const backdropSrc = useMemo(
    () => gameProduct.games[0].bgImage,
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

  return (
    <div className='group relative w-fit p-0.5'>
      <article
        className={cx(
          'relative w-[344px] h-[550px] rounded-2xl overflow-hidden z-10 shadow-[0_2px_6px_rgba(0,0,0,0.3)]',
          className,
        )}
      >
        <div className='relative flex flex-col justify-end w-full h-full z-10'>
          <div className='px-5 pb-2'>
            <BaseTypography className='leading-none' variant='h4'>
              {name}
            </BaseTypography>
            <div className='h-0 group-hover:!h-6 overflow-hidden transition-[height] duration-300 delay-500'>
              <span className='text-xs leading-none'>
                {publisher}
                <span className='mx-1'> / </span>
                {developer}
              </span>
            </div>
          </div>
          <GameProductCardInfo gameProduct={gameProduct} />
        </div>
        <div className='absolute top-0 left-0 w-full h-full bg-backdrop'>
          <Image
            src={backdropSrc}
            alt={name}
            className={
              'object-cover opacity-100 scale-100 transition-all ease-linear duration-200 group-hover:!scale-125' +
              ' group-hover:!opacity-70 group-hover:!duration-[20000ms]'
            }
            fill
          />
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent to-60% z-[1]' />
        </div>
      </article>
      <Image
        src={gpBorderPng}
        alt=''
        className='absolute left-0 top-0 object-cover opacity-0 group-hover:!opacity-100 transition-opacity'
        fill
      />
    </div>
  );
});

export default GameProductCard;
