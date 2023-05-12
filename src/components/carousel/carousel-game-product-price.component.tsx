import { memo, useMemo } from 'react';
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
        <div className='flex justify-around items-center mx-auto mb-1 px-2 pb-1 pt-1.5 w-4/5 bg-green-500 text-sm leading-none rounded-lg uppercase'>
          <span className='mr-2 line-through'>{price}</span>
          <span className='font-bold'>{`${discount}% off`}</span>
        </div>
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
