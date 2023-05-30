'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MenuHandler } from '@material-tailwind/react';

import { useWishList } from '#/hooks/use-wish-list.hook';
import { useCart } from '#/hooks/use-cart.hook';
import { useGenres } from '#/hooks/use-genres.hook';
import { useGenre } from '#/hooks/use-genre.hook';
import BaseScene from '#/components/base/base-scene.component';
import BaseImageBackdrop from '#/components/base/base-image-backdrop';
import BaseTypography from '#/components/base/base-typography.component';
import BaseButton from '#/components/base/base-button.component';
import BaseIcon from '#/components/base/base-icon.component';
import BaseMenuList from '#/components/base/base-menu-list.component';
import BaseMenuItem from '#/components/base/base-menu-item.component';
import GenreGameProductGrid from '#/components/genre/genre-game-product-grid.component';

const SingleGenrePage = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const router = useRouter();
  const { initialLoading: allGenresLoading, genres } = useGenres();
  const { initialLoading: genreLoading, genre, gameProducts } = useGenre(slug);
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

  const genreName = useMemo(
    () => (!!genre ? `${genre.name} Games` : false),
    [genre],
  );

  const backdropSrc = useMemo(() => genre?.coverImage, [genre]);

  return (
    <BaseScene className='relative' loading={allGenresLoading || genreLoading}>
      <div className='max-w-main mx-auto pt-8'>
        <div className='flex w-full justify-between items-center relative mb-8 leading-none z-10'>
          <BaseTypography className='text-3xl' variant='h1'>
            {genreName}
          </BaseTypography>
          <Menu>
            <MenuHandler>
              <BaseButton
                className='flex justify-center items-center leading-none'
                size='lg'
              >
                Genres
                <BaseIcon
                  name='caret-down'
                  className='-mt-[2px] ml-2'
                  width={20}
                  height={20}
                  weight='bold'
                />
              </BaseButton>
            </MenuHandler>
            <BaseMenuList>
              {genres?.map((g) => (
                <BaseMenuItem
                  key={g.id}
                  className='flex justify-start items-center'
                  onClick={() => router.push(`/genres/${g.slug}`)}
                >
                  {g.name}
                </BaseMenuItem>
              ))}
            </BaseMenuList>
          </Menu>
        </div>
        {!!backdropSrc && (
          <BaseImageBackdrop src={backdropSrc} className='!h-[800px]' />
        )}
        {!!gameProducts && !!gameProducts.length && (
          <GenreGameProductGrid
            className='relative z-10'
            gameProducts={gameProducts}
            wishListGameProductIds={wishListGameProductIds}
            disabled={cartLoading || wishListLoading}
            onAddToCart={addCartItem}
            onToggleToWishList={toggleGameProduct}
          />
        )}
      </div>
    </BaseScene>
  );
};

export default SingleGenrePage;
