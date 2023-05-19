import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';
import GameProductCard from '../game-product/game-product-card.component';

import type { ComponentProps } from 'react';
import type { CartItem } from '#/types/cart.type';
import type { GameProduct } from '#/types/game-product.type';

type Props = ComponentProps<'div'> & {
  gameProducts: GameProduct[];
  initiaLoading?: boolean;
  disabled?: boolean;
  onAddToCart?: (cartItem: CartItem) => Promise<number>;
  onToggleToWishList?: (gameProductId: number) => void;
  onEmpty?: () => Promise<boolean>;
};

const animate = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
  transition: { ease: 'easeInOut', duration: 0.5 },
};

const WishListGameProductGrid = memo(function WishListGameProductGrid({
  className,
  gameProducts,
  disabled,
  onAddToCart,
  onToggleToWishList,
  onEmpty,
  ...moreProps
}: Props) {
  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='grid grid-cols-4 gap-4 w-full mb-6'>
        <AnimatePresence>
          {gameProducts.map((gp) => (
            <motion.div key={gp.id} {...animate}>
              <GameProductCard
                gameProduct={gp}
                disabled={disabled}
                onAddToCart={onAddToCart}
                onToggleToWishList={onToggleToWishList}
                isWishListed
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <BaseButton
        disabled={disabled}
        variant='outlined'
        onClick={onEmpty}
        fullWidth
      >
        Clear Wish List
      </BaseButton>
    </div>
  );
});

export default WishListGameProductGrid;
