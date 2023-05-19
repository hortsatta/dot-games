'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useCart } from '#/hooks/use-cart.hook';
import { useWishList } from '#/hooks/use-wish-list.hook';
import BaseIcon from '#/components/base/base-icon.component';
import BaseScene from '#/components/base/base-scene.component';
import BaseSpinner from '#/components/base/base-spinner.component';
import BaseSceneTitle from '#/components/base/base-scene-title.component';
import WishListGameProductGrid from '#/components/wish-list/wish-list-game-product-grid.component';

import type { GameProduct } from '#/types/game-product.type';

const animate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const WishListPage = () => {
  const { loading: cartLoading, addCartItem } = useCart();
  const {
    initialLoading,
    loading: wishListLoading,
    wishListGameProducts,
    toggleGameProduct,
    emptyWishList,
  } = useWishList(true);

  const gameProducts: GameProduct[] = useMemo(
    () =>
      wishListGameProducts
        .map((gp) => gp.gameProduct)
        .filter((gp) => !!gp) as GameProduct[],
    [wishListGameProducts],
  );

  return (
    <BaseScene className='relative'>
      <AnimatePresence>
        {initialLoading && (
          <motion.div
            className='absolute top-0 left-0 w-full min-h-[702px] h-full bg-backdrop/50 z-50'
            {...animate}
          >
            <BaseSpinner className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10' />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!gameProducts.length ? (
          <div
            key='empty'
            className='absolute top-[72px] p-8 pt-16 w-full flex flex-col items-center'
          >
            <BaseIcon
              name='selection-slash'
              className='mb-4 fill-current-dark/50'
              width={56}
              height={56}
            />
            <span className='dark:text-current-dark/50'>
              Your wish list is empty! There is nothing to show.
            </span>
          </div>
        ) : (
          <motion.div
            key='not-empty'
            className='mx-auto max-w-main py-8 w-full'
            {...animate}
          >
            <BaseSceneTitle>Wish List</BaseSceneTitle>
            <WishListGameProductGrid
              gameProducts={gameProducts}
              disabled={initialLoading || cartLoading || wishListLoading}
              onAddToCart={addCartItem}
              onToggleToWishList={toggleGameProduct}
              onEmpty={emptyWishList}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </BaseScene>
  );
};

export default WishListPage;
