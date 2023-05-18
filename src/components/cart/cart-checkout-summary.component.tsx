import { memo } from 'react';
import { cx } from 'classix';

import BaseFieldTitle from '../base/base-field-title.component';
import BaseDivider from '../base/base-divider.component';
import BaseButton from '../base/base-button.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  cartItemCount: number;
  subTotalAmount: number;
  shippingFee: number;
  totalAmount: number;
  onCheckout?: () => void;
};

const FIELD_CLASSNAME = 'flex flex-col items-end mb-4';
const FIELD_VALUE_CLASSNAME = 'text-xl font-medium';
const CURRENCY_CLASSNAME =
  'mr-0.5 inline-block text-base font-normal -translate-y-[1px]';

const CartCheckoutSummary = memo(function CartCheckoutSummary({
  className,
  cartItemCount,
  shippingFee,
  subTotalAmount,
  totalAmount,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex-1 min-h-full flex flex-col justify-between',
        className,
      )}
      {...moreProps}
    >
      <div>
        <div>
          <div className={cx(FIELD_CLASSNAME, '!mb-0 !items-start')}>
            <span>
              <span>
                <span className={FIELD_VALUE_CLASSNAME}>{cartItemCount}</span>
              </span>
              <BaseFieldTitle>Items</BaseFieldTitle>
            </span>
            <BaseDivider className='w-full dark:border-current-dark/10' />
          </div>
          <div className={FIELD_CLASSNAME}>
            <span>
              <span className={CURRENCY_CLASSNAME}>$</span>
              <span className={FIELD_VALUE_CLASSNAME}>
                {subTotalAmount.toFixed(2)}
              </span>
            </span>
            <BaseFieldTitle>Subtotal</BaseFieldTitle>
          </div>
          <div className={FIELD_CLASSNAME}>
            <span>
              <span className={CURRENCY_CLASSNAME}>$</span>
              <span className={FIELD_VALUE_CLASSNAME}>
                {shippingFee.toFixed(2)}
              </span>
            </span>
            <BaseFieldTitle>Shipping Fee</BaseFieldTitle>
          </div>
          <BaseDivider className='dark:border-current-dark/10' />
        </div>
        <div className={FIELD_CLASSNAME}>
          <span className='block w-full bg-secondary text-end px-2 mb-1.5 rounded-sm !text-white'>
            <span className={CURRENCY_CLASSNAME}>$</span>
            <span className={FIELD_VALUE_CLASSNAME}>
              {totalAmount.toFixed(2)}
            </span>
          </span>
          <BaseFieldTitle>Total</BaseFieldTitle>
        </div>
      </div>
      <BaseButton className='min-h-[72px]' size='lg' fullWidth>
        Checkout
      </BaseButton>
    </div>
  );
});

export default CartCheckoutSummary;
