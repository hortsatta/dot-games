'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { useCart } from '#/hooks/use-cart.hook';
import { useCheckout } from '#/hooks/use-checkout.hook';
import BaseSurface from '#/components/base/base-surface.component';
import BaseScene from '#/components/base/base-scene.component';
import BaseSceneTitle from '#/components/base/base-scene-title.component';
import BaseSpinner from '#/components/base/base-spinner.component';
import BaseIcon from '#/components/base/base-icon.component';
import CartList from '#/components/cart/cart-list.component';
import CartCheckoutSummary from '#/components/cart/cart-checkout-summary.component';

const animate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const CartPage = () => {
  const {
    loading: cartLoading,
    addCartItem,
    subtractCartItem,
    removeCartItem,
    emptyCartItems,
  } = useCart();

  const {
    loading: checkoutLoading,
    checkoutCartItems,
    cartItemCount,
    shippingFee,
    subTotalAmount,
    totalAmount,
  } = useCheckout();

  return (
    <BaseScene className='relative'>
      <AnimatePresence>
        {(cartLoading || checkoutLoading) && (
          <motion.div
            className='absolute top-0 left-0 w-full min-h-[702px] h-full bg-backdrop/50 z-10'
            {...animate}
          >
            <BaseSpinner className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10' />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!checkoutCartItems.length ? (
          <div
            key='empty'
            className='absolute top-[72px] p-8 pt-16 w-full flex flex-col items-center'
          >
            <BaseIcon
              name='selection-slash'
              className='mb-4 fill-current-dark/50'
              width={56}
              height={56}
            />
            <span className='dark:text-current-dark/50'>
              Your cart is empty! There is nothing to show.
            </span>
          </div>
        ) : (
          <motion.div
            key='not-empty'
            className='mx-auto max-w-main py-8 px-4 w-fit'
            {...animate}
          >
            <BaseSceneTitle className='ml-4'>Shopping Cart</BaseSceneTitle>
            <div className='flex relative'>
              <div className='flex items-start min-h-full'>
                <CartList
                  className='min-h-full flex pr-4 pt-6 pb-4'
                  cartItems={checkoutCartItems}
                  loading={cartLoading}
                  onAdd={addCartItem}
                  onSubtract={subtractCartItem}
                  onRemove={removeCartItem}
                  onEmpty={emptyCartItems}
                />
                <BaseSurface className='flex py-6 px-8 min-w-[260px] min-h-full'>
                  <CartCheckoutSummary
                    cartItemCount={cartItemCount}
                    shippingFee={shippingFee}
                    subTotalAmount={subTotalAmount}
                    totalAmount={totalAmount}
                  />
                </BaseSurface>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BaseScene>
  );
};

export default CartPage;
