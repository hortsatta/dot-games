import { memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { cx } from 'classix';

import BaseTypography from '../base/base-typography.component';
import BaseTag from '../base/base-tag.component';
import BaseIcon from '../base/base-icon.component';
import BaseIconButton from '../base/base-icon-button.component';

import type { ComponentProps } from 'react';
import type { CartItem } from '#/types/cart.type';

type Props = ComponentProps<'div'> & {
  item: CartItem;
  loading?: boolean;
  onAdd?: (cartItem: CartItem) => Promise<number>;
  onSubtract?: (cartItem: CartItem) => void;
  onRemove?: (gameProductId: number) => void;
};

const CURRENCY_CLASSNAME =
  'mr-0.5 inline-block text-base font-normal -translate-y-[1px]';

const removeIconButton: Omit<ComponentProps<typeof BaseIconButton>, 'name'> = {
  size: 'sm',
  variant: 'outlined',
  className: '!rounded-full !w-6 !h-6',
  iconProps: { className: 'fill-primary' },
};

const qtyIconButton: Omit<ComponentProps<typeof BaseIconButton>, 'name'> = {
  size: 'sm',
  variant: 'outlined',
  color: 'white',
  className: '!rounded-full !w-6 !h-6',
};

const CartItemCard = memo(function CartItemCard({
  className,
  item,
  loading,
  onAdd,
  onSubtract,
  onRemove,
  ...moreProps
}: Props) {
  const href = useMemo(
    () => '/games/' + item.gameProduct?.games[0].slug,
    [item],
  );
  const name = useMemo(() => item.gameProduct?.games[0].name, [item]);
  const publisher = useMemo(
    () => item.gameProduct?.games[0].publishers[0].name,
    [item],
  );
  const discount = useMemo(() => item.gameProduct?.discount, [item]);
  const price = useMemo(() => item.gameProduct?.price, [item]);
  const finalPrice = useMemo(
    () => item.gameProduct?.finalPrice.toFixed(2),
    [item],
  );
  const quantity = useMemo(() => item.quantity, [item]);
  const total = useMemo(
    () => (quantity * Number(finalPrice)).toFixed(2),
    [quantity, finalPrice],
  );

  // Add 1 to current item quantity
  const handleAdd = useCallback(async () => {
    if (!onAdd) {
      return;
    }
    await onAdd({ ...item, quantity: 1 });
  }, [item, onAdd]);

  // Subtract 1 to current item quantity
  const handleSubtract = useCallback(async () => {
    if (!onSubtract) {
      return;
    }
    await onSubtract(item);
  }, [item, onSubtract]);

  // Remove item from cart
  const handleRemove = useCallback(async () => {
    if (!onRemove) {
      return;
    }
    await onRemove(Number(item.gameProductId));
  }, [item, onRemove]);

  return (
    <div
      className={cx('flex items-center justify-between', className)}
      {...moreProps}
    >
      <div className='pl-2 pr-4'>
        <BaseIconButton
          name='x'
          aria-label='remove item'
          disabled={loading}
          onClick={handleRemove}
          {...removeIconButton}
        />
      </div>
      <div className='mr-4 w-[260px]'>
        <Link href={href}>
          <BaseTypography className='text-lg font-medium !leading-none hover:underline'>
            {name}
          </BaseTypography>
        </Link>
        <span className='text-sm text-current-dark/50'>{publisher}</span>
      </div>
      <div className='mr-4 flex flex-col items-end min-w-[100px]'>
        <span className='text-xl'>
          <span className={CURRENCY_CLASSNAME}>$</span>
          {finalPrice}
        </span>
        {!!discount && (
          <BaseTag className='!pt-0.5 !pb-0 !text-xs !font-normal !rounded-sm'>
            <span className='mr-2 line-through'>${price}</span>
            {discount}%
          </BaseTag>
        )}
      </div>
      <div className='ml-2 mr-4'>
        <BaseIcon
          name='x'
          className='fill-current-dark/30'
          width={24}
          height={24}
        />
      </div>
      <div className='mr-4 flex justify-center items-center text-center'>
        <BaseIconButton
          name='minus'
          aria-label='subtract 1'
          disabled={loading}
          onClick={handleSubtract}
          {...qtyIconButton}
        />
        <span className='mx-2 w-10 text-xl'>{quantity}</span>
        <BaseIconButton
          name='plus'
          aria-label='add 1'
          disabled={loading}
          onClick={handleAdd}
          {...qtyIconButton}
        />
      </div>
      <div className='flex-1 text-end'>
        <span className='text-xl font-medium'>
          <span className={CURRENCY_CLASSNAME}>$</span>
          {total}
        </span>
      </div>
    </div>
  );
});

export default CartItemCard;
