'use client';

import { useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useBoundStore } from '#/hooks/use-store.hook';
import { useCurrentUserAccount } from '#/hooks/use-current-user-account.hook';
import { useCart } from '#/hooks/use-cart.hook';
import { useWishList } from '#/hooks/use-wish-list.hook';
import BaseIcon from '#/components/base/base-icon.component';
import BaseScene from '#/components/base/base-scene.component';
import BaseSceneTitle from '#/components/base/base-scene-title.component';
import AuthSignInCard from '#/components/auth/auth-sign-in-card.component';
import WishListGameProductGrid from '#/components/wish-list/wish-list-game-product-grid.component';

import type { GameProduct } from '#/types/game-product.type';

const animate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const WishListPage = () => {
  const setShowLogin = useBoundStore((state) => state.setShowLogin);
  const { initialLoading: userAccountInitialLoading, currentUserAccount } =
    useCurrentUserAccount();
  const { loading: cartLoading, addCartItem } = useCart();
  const {
    initialLoading: wishListInitialLoading,
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

  const handleSignIn = useCallback(() => {
    setShowLogin(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseScene
      className='relative'
      loading={wishListInitialLoading || userAccountInitialLoading}
    >
      {!currentUserAccount ? (
        <AuthSignInCard
          className='p-8 pt-16'
          labelAppend='to view your wish list'
          onSignIn={handleSignIn}
        />
      ) : (
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
                disabled={
                  wishListInitialLoading || cartLoading || wishListLoading
                }
                onAddToCart={addCartItem}
                onToggleToWishList={toggleGameProduct}
                onEmpty={emptyWishList}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </BaseScene>
  );
};

export default WishListPage;
