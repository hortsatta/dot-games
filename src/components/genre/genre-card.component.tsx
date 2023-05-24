import { memo, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cx } from 'classix';

import BaseTypography from '../base/base-typography.component';

import type { ComponentProps } from 'react';
import type { Genre } from '#/types/genre.type';

type Props = ComponentProps<'article'> & {
  genre: Genre;
};

const GenreCard = memo(function GenreCard({
  className,
  genre,
  ...moreProps
}: Props) {
  const href = useMemo(() => '/genres/' + genre.slug, [genre]);
  const name = useMemo(() => genre.name || genre.slug, [genre]);
  const imageSrc = useMemo(() => genre.coverImage || '', [genre]);

  return (
    <div className='group relative w-fit p-0.5 rounded-2xl overflow-hidden'>
      <article
        className={cx(
          'relative w-[465px] h-[262px] rounded-2xl overflow-hidden z-10 shadow-[0_2px_6px_rgba(0,0,0,0.3)]',
          className,
        )}
        {...moreProps}
      >
        <Link
          className='absolute top-0 left-0 inline-block w-full h-full flex justify-start items-end'
          href={href}
        >
          <BaseTypography
            className='group-hover:text-primary group-hover:pl-8 relative pl-0 ml-[130px] mb-[30px] leading-none z-10 transition-all duration-500'
            variant='h3'
          >
            {name}
          </BaseTypography>
          <div className='group-hover:grayscale grayscale-0 absolute left-0 top-0 w-full h-full transition-[filter] duration-300'>
            <Image
              src={imageSrc}
              alt={name}
              className='object-cover'
              quality={100}
              fill
            />
          </div>
        </Link>
      </article>
      <div className='group-hover:opacity-100 opacity-0 absolute w-full h-full top-0 left-0 bg-gradient-to-t from-primary to-transparent to-70% transition-opacity rounded-2xl overflow-hidden' />
    </div>
  );
});

export default GenreCard;
