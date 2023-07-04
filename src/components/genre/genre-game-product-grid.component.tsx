import { memo, useCallback } from 'react';
import { cx } from 'classix';

import GameProductCard from '../game-product/game-product-card.component';

import type { ComponentProps } from 'react';
import type { GameProduct } from '#/types/game-product.type';
import type { CartItem } from '#/types/cart.type';

type Props = ComponentProps<'div'> & {
  gameProducts: GameProduct[];
  wishListGameProductIds?: number[];
  disabled?: boolean;
  onAddToCart?: (cartItem: CartItem) => Promise<number>;
  onToggleToWishList?: (gameProductId: number) => void;
};

const GenreGameProductGrid = memo(function GenreGameProductGrid({
  className,
  gameProducts,
  wishListGameProductIds = [],
  disabled,
  onAddToCart,
  onToggleToWishList,
  ...moreProps
}: Props) {
  const handleIsWishListed = useCallback(
    (gameProduct: GameProduct) =>
      wishListGameProductIds.some((id) => id === gameProduct.id),
    [wishListGameProductIds],
  );

  return (
    <div
      className={cx('flex flex-wrap gap-4 w-full mb-6', className)}
      {...moreProps}
    >
      {gameProducts.map((gp) => (
        <div key={gp.id}>
          <GameProductCard
            gameProduct={gp}
            isWishListed={handleIsWishListed(gp)}
            disabled={disabled}
            onAddToCart={onAddToCart}
            onToggleToWishList={onToggleToWishList}
          />
        </div>
      ))}
    </div>
  );
});

export default GenreGameProductGrid;
