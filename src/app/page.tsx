'use client';

import { useCart } from '#/hooks/use-cart.hook';
import { useCarouselItems } from '#/hooks/use-carousel-items.hook';
import useLatestReleasedGameProducts from '#/hooks/use-latest-released-game-products.hook';
import BaseDivider from '#/components/base/base-divider.component';
import Carousel from '#/components/carousel/carousel.component';
import GameProductNewReleasesList from '#/components/game-product/game-product-new-releases-list.component';
import { useWishList } from '#/hooks/use-wish-list.hook';
import { useMemo } from 'react';

export const revalidate = 0;

const HomePage = () => {
  const { carouselItems } = useCarouselItems();
  const { gameProducts } = useLatestReleasedGameProducts();
  const { loading: cartLoading, addCartItem } = useCart();
  const {
    loading: wishListLoading,
    wishListGameProducts,
    toggleGameProduct,
  } = useWishList();

  const wishListGameProductIds = useMemo(
    () => wishListGameProducts.map((gp) => gp.gameProductId),
    [wishListGameProducts],
  );

  return (
    <div>
      {!!carouselItems && (
        <Carousel
          itemClassName='max-w-[884px]'
          items={carouselItems}
          wishListGameProductIds={wishListGameProductIds}
          autoplaySpeed={8000}
          disabled={cartLoading || wishListLoading}
          onAddToCart={addCartItem}
          onToggleToWishList={toggleGameProduct}
        />
      )}
      {!!gameProducts && (
        <div className='max-w-main mx-auto'>
          <BaseDivider className='!mt-7 !mb-14' />
          <GameProductNewReleasesList
            gameProducts={gameProducts}
            wishListGameProductIds={wishListGameProductIds}
            disabled={cartLoading || wishListLoading}
            onAddToCart={addCartItem}
            onToggleToWishList={toggleGameProduct}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
