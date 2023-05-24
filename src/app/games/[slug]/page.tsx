'use client';

import { useMemo } from 'react';

import { useCart } from '#/hooks/use-cart.hook';
import { useWishList } from '#/hooks/use-wish-list.hook';
import { useGameProducts } from '#/hooks/use-game-products.hook';
import BaseScene from '#/components/base/base-scene.component';
import BaseImageBackdrop from '#/components/base/base-image-backdrop';
import GameProductSingle from '#/components/game-product/game-product-single.component';

const SingleGameProductPage = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const { initialLoading, gameProducts } = useGameProducts(slug);
  const { loading: cartLoading, addCartItem } = useCart();
  const {
    loading: wishListLoading,
    wishListGameProducts,
    toggleGameProduct,
  } = useWishList();

  const backdropSrc = useMemo(
    () => (gameProducts ? gameProducts[0].games[0].bgImage : null),
    [gameProducts],
  );

  const isWishListed = useMemo(
    () =>
      gameProducts
        ? wishListGameProducts.some(
            ({ gameProductId }) => gameProductId === gameProducts[0].id,
          )
        : false,
    [gameProducts, wishListGameProducts],
  );

  return (
    <BaseScene className='mb-8' loading={initialLoading}>
      {!!gameProducts && (
        <div>
          {!!backdropSrc && <BaseImageBackdrop src={backdropSrc} />}
          <GameProductSingle
            className='pt-8 mx-auto w-full z-10'
            gameProducts={gameProducts || []}
            isWishListed={isWishListed}
            disabled={cartLoading || wishListLoading}
            onAddToCart={addCartItem}
            onToggleToWishList={toggleGameProduct}
          />
        </div>
      )}
    </BaseScene>
  );
};

export default SingleGameProductPage;
