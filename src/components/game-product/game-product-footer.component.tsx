import { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import cx from 'classix';

import BaseSurface from '../base/base-surface.component';
import BaseTypography from '../base/base-typography.component';
import BaseFieldTitle from '../base/base-field-title.component';
import BaseIcon from '../base/base-icon.component';

import type { ComponentProps } from 'react';
import type { GameProduct } from '#/types/game-product.type';

type Props = ComponentProps<'div'> & {
  gameProduct: GameProduct;
};

const ROW_CLASSNAME = 'text-center';
const ROW_VALUE_CLASSNAME = 'mb-1.5 text-base leading-none';
const ROW_TITLE_CLASSNAME = 'text-sm';

const GameProductSingleFooter = memo(function GameProductSingleFooter({
  className,
  gameProduct,
  ...moreProps
}: Props) {
  const genres = useMemo(
    () => gameProduct.games[0].genres.map((g) => g.name).join(', '),
    [gameProduct],
  );

  const releaseDate = useMemo(
    () =>
      dayjs(new Date(gameProduct.games[0].released)).format('MMMM DD, YYYY'),
    [gameProduct],
  );

  const website = useMemo(() => gameProduct.games[0].website, [gameProduct]);

  return (
    <BaseSurface
      className={cx('py-4 px-24 flex justify-between items-end', className)}
      {...moreProps}
    >
      <div className={ROW_CLASSNAME}>
        <BaseTypography className={ROW_VALUE_CLASSNAME} variant='paragraph'>
          {genres}
        </BaseTypography>
        <BaseFieldTitle className={ROW_TITLE_CLASSNAME} variant='h3'>
          Genres
        </BaseFieldTitle>
      </div>
      <div className={ROW_CLASSNAME}>
        <BaseTypography className={ROW_VALUE_CLASSNAME} variant='paragraph'>
          {releaseDate}
        </BaseTypography>
        <BaseFieldTitle className={ROW_TITLE_CLASSNAME} variant='h3'>
          Release Date
        </BaseFieldTitle>
      </div>
      <div className={ROW_CLASSNAME}>
        <a
          href={website}
          target='_blank'
          className='group/link flex justify-center items-end'
        >
          <BaseTypography
            className='group-hover/link:!text-blue-300 mb-[1px] mr-1 uppercase font-medium !text-blue-500 text-base leading-none'
            variant='paragraph'
          >
            Official Site
          </BaseTypography>
          <BaseIcon
            name='arrow-square-out'
            className='group-hover/link:!fill-blue-300 fill-blue-500'
            width={22}
            height={22}
            weight='fill'
          />
        </a>
        <BaseFieldTitle className={ROW_TITLE_CLASSNAME} variant='h3'>
          Website
        </BaseFieldTitle>
      </div>
    </BaseSurface>
  );
});

export default GameProductSingleFooter;
