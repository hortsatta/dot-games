import { memo, useCallback, useRef } from 'react';
import SimpleBar from 'simplebar-react';

import BaseTypography from '../base/base-typography.component';
import BaseIconButton from '../base/base-icon-button.component';
import GameProductCard from './game-product-card.component';

import type { ComponentProps } from 'react';
import type { GameProduct } from '#/types/game-product.type';
import type { CartItem } from '#/types/cart.type';

const CARD_WIDTH = 344;
const CARD_GAP = 16;

type Props = ComponentProps<'div'> & {
  gameProducts: GameProduct[];
  disabled?: boolean;
  onAddToCart?: (cartItem: CartItem) => Promise<number>;
  onAddToWishList?: (gameProduct: GameProduct) => void;
};

const GameProductNewReleasesList = memo(function GameProductNewReleasesList({
  className,
  gameProducts,
  disabled,
  onAddToCart,
  onAddToWishList,
  ...moreProps
}: Props) {
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
    <div className={className} {...moreProps}>
      <div className='flex justify-between items-center mb-6'>
        <BaseTypography
          className='text-base font-medium leading-none'
          variant='h3'
        >
          New Releases
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
          {gameProducts.map((gp) => (
            <GameProductCard
              key={gp.id}
              gameProduct={gp}
              disabled={disabled}
              onAddToCart={onAddToCart}
              onAddToWishList={() => onAddToWishList && onAddToWishList(gp)}
            />
          ))}
        </div>
      </SimpleBar>
    </div>
  );
});

export default GameProductNewReleasesList;
