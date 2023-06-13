import { memo } from 'react';
import SimpleBar from 'simplebar-react';

import type { ComponentProps } from 'react';
import type { CartItem } from '#/types/cart.type';

type Props = ComponentProps<'div'> & {
  cartItems: CartItem[];
};

const CheckoutItemList = memo(function CheckoutItemList({
  cartItems,
  ...moreProps
}: Props) {
  return (
    <div {...moreProps}>
      <SimpleBar className='pl-8 pr-7 h-full overflow-x-hidden'>
        {cartItems.map((item) => (
          <div
            key={item.gameProductId}
            className='mb-4 last:mb-0 flex flex-col items-start justify-start'
          >
            <span>{item.gameProduct?.games[0].name}</span>
            <span>
              ${item.gameProduct?.finalPrice.toFixed(2)} x {item.quantity}
            </span>
            <span>
              Total: $
              {((item.gameProduct?.finalPrice || 0) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </SimpleBar>
    </div>
  );
});

export default CheckoutItemList;
