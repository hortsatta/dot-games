import { memo, useMemo } from 'react';
import BaseTag from '../base/base-tag.component';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  price: number;
  finalPrice: number;
  discount?: number;
};

const CarouselGameProductPrice = memo(function CarouselGameProductPrice({
  price,
  finalPrice,
  discount,
  ...moreProps
}: Props) {
  const whole = useMemo(
    () => finalPrice.toString().split('.')[0],
    [finalPrice],
  );
  const fraction = useMemo(
    () => finalPrice.toString().split('.')[1] || '00',
    [finalPrice],
  );

  return (
    <div {...moreProps}>
      {!!discount && (
        <BaseTag className='flex justify-around items-center mx-auto mb-1 w-4/5'>
          <span className='mr-2 font-normal line-through'>${price}</span>
          <span>{discount}% off</span>
        </BaseTag>
      )}
      <div className='flex justify-center items-end w-full font-semibold text-white'>
        <span className='self-start pt-1 text-2xl'>$</span>
        <span className='mr-1 h-[57px] text-6xl leading-none -tracking-[2px]'>
          {whole}
        </span>
        <span className='mt-5 text-3xl'>{fraction}</span>
      </div>
    </div>
  );
});

export default CarouselGameProductPrice;
