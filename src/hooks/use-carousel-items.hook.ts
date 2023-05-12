import { useEffect, useState } from 'react';

import { getCarouselItems } from '#/api/carousel.api';
import { useSupabase } from '#/components/core/core-supabase-provider';

import type { CarouselItem } from '#/types/carousel.type';

type Result = {
  carouselItems: CarouselItem[] | undefined;
};

export const useCarouselItems = (): Result => {
  const { supabase } = useSupabase();
  const [carouselItems, setCarouselItems] = useState<
    CarouselItem[] | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const carouselItems = await getCarouselItems(supabase);
      setCarouselItems(carouselItems);
    })();
  }, [supabase]);

  return { carouselItems };
};
