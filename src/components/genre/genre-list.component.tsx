import { memo, useCallback, useRef } from 'react';
import SimpleBar from 'simplebar-react';

import BaseIconButton from '../base/base-icon-button.component';
import BaseTypography from '../base/base-typography.component';
import GenreCard from './genre-card.component';

import type { ComponentProps } from 'react';
import type { Genre } from '#/types/genre.type';

type Props = ComponentProps<'div'> & {
  genres: Genre[];
};

const CARD_WIDTH = 465;
const CARD_GAP = 16;

const GenreList = memo(function GenreList({ genres, ...moreProps }: Props) {
  const scrollableNodeRef = useRef<any>(null);

  const scrollToLeft = useCallback(() => {
    !!scrollableNodeRef.current &&
      scrollableNodeRef.current.scrollBy({
        left: -(CARD_WIDTH + CARD_GAP),
        top: 0,
        behavior: 'smooth',
      });
  }, []);

  const scrollToRight = useCallback(() => {
    !!scrollableNodeRef.current &&
      scrollableNodeRef.current.scrollBy({
        left: CARD_WIDTH + CARD_GAP,
        top: 0,
        behavior: 'smooth',
      });
  }, []);

  return (
    <div {...moreProps}>
      <div className='flex justify-between items-center mb-6'>
        <BaseTypography
          className='text-base font-medium leading-none'
          variant='h3'
        >
          Browse Games by Genre
        </BaseTypography>
        <div className='flex items-center'>
          <BaseIconButton
            name='caret-left'
            className='mr-2.5'
            color='white'
            variant='outlined'
            size='sm'
            onClick={scrollToLeft}
            round
          />
          <BaseIconButton
            name='caret-right'
            color='white'
            variant='outlined'
            size='sm'
            onClick={scrollToRight}
            round
          />
        </div>
      </div>
      <SimpleBar
        className='pb-4 overflow-y-hidden'
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        <div className='grid grid-flow-col auto-cols-max gap-4 w-full'>
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </SimpleBar>
    </div>
  );
});

export default GenreList;
