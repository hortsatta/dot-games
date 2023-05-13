import camelcaseKeys from 'camelcase-keys';

import { getGameProductsByIds } from './game-product.api';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { BaseOrderBy } from '#/types/base.type';
import type { CarouselDb, CarouselItem } from '#/types/carousel.type';

const defaultOrderBy: BaseOrderBy<CarouselDb['Row']> = {
  columnName: 'created_at',
  ascending: false,
};

const defaultOptions = {
  orderBy: defaultOrderBy,
  limit: 4,
};

export async function getCarouselItems(
  supabase: SupabaseClient<Database>,
  options = defaultOptions,
): Promise<CarouselItem[]> {
  const { orderBy, limit } = options;

  try {
    const { data: carouselData } = await supabase
      .from('carousel')
      .select()
      .order(orderBy.columnName, { ascending: orderBy.ascending })
      .limit(limit);

    const gameProductIds =
      carouselData
        ?.filter(({ content }) => !!content && content.type === 'game')
        .map(({ content }) => !!content && content.game_product_id) || [];

    const gameProducts = await getGameProductsByIds(supabase, gameProductIds);

    const carouselItems = carouselData?.map(
      ({ content, ...moreItem }, index: number) => {
        if (content?.type === 'game') {
          const { game_product_id, image_url, ...moreContent } = content;

          const gameProduct = {
            ...gameProducts.find((gp) => gp.id === game_product_id),
            carouselImageUrl: image_url,
          };

          return camelcaseKeys({
            ...moreItem,
            index,
            content: { ...moreContent, type: content.type, gameProduct },
          });
        } else {
          return camelcaseKeys({ ...moreItem, content });
        }
      },
    );

    return carouselItems || ([] as any);
  } catch (error) {
    return [];
  }
}
