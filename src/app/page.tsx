'use client';

import { useMemo } from 'react';
import Image from 'next/image';

import { useCart } from '#/hooks/use-cart.hook';
import { useWishList } from '#/hooks/use-wish-list.hook';
import { useCarouselItems } from '#/hooks/use-carousel-items.hook';
import { useLatestReleasedGameProducts } from '#/hooks/use-latest-released-game-products.hook';
import { useDiscountedGameProducts } from '#/hooks/use-discounted-game-products.hook';
import { useGenres } from '#/hooks/use-genres.hook';
import BaseDivider from '#/components/base/base-divider.component';
import Carousel from '#/components/carousel/carousel.component';
import GameProductNewReleasesList from '#/components/game-product/game-product-new-releases-list.component';
import GameProductDiscountedList from '#/components/game-product/game-product-discounted-list.component';
import GenreList from '#/components/genre/genre-list.component';

export const revalidate = 0;

const INTERMISSION_PNG = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/main/images/intermission.png`;

const HomePage = () => {
  const { carouselItems } = useCarouselItems();
  const { gameProducts: latestGameProducts } = useLatestReleasedGameProducts();
  const { gameProducts: discountedGameProducts } = useDiscountedGameProducts();
  const { loading: cartLoading, addCartItem } = useCart();

  const {
    loading: wishListLoading,
    wishListGameProducts,
    toggleGameProduct,
  } = useWishList();

  const { genres } = useGenres();

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
      {!!latestGameProducts && (
        <div className='max-w-main mx-auto mb-12'>
          <BaseDivider className='!mt-7 !mb-14' />
          <GameProductNewReleasesList
            gameProducts={latestGameProducts}
            wishListGameProductIds={wishListGameProductIds}
            disabled={cartLoading || wishListLoading}
            onAddToCart={addCartItem}
            onToggleToWishList={toggleGameProduct}
          />
        </div>
      )}
      {!!discountedGameProducts && (
        <GameProductDiscountedList
          className='max-w-main mx-auto mb-12'
          gameProducts={discountedGameProducts}
          wishListGameProductIds={wishListGameProductIds}
          disabled={cartLoading || wishListLoading}
          onAddToCart={addCartItem}
          onToggleToWishList={toggleGameProduct}
        />
      )}
      {!!genres && (
        <GenreList className='max-w-main mx-auto mb-20' genres={genres} />
      )}
      <Image
        src={INTERMISSION_PNG}
        alt='intermission'
        className='mx-auto mb-28'
        width={1442}
        height={388}
        quality={100}
      />
    </div>
  );
};

export default HomePage;
