'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { useCurrentUserAccount } from '#/hooks/use-current-user-account.hook';
import { useAddress } from '#/hooks/use-address.hook';
import { useCheckout } from '#/hooks/use-checkout.hook';
import BaseDialog from '#/components/base/base-dialog.component';
import BaseSurface from '#/components/base/base-surface.component';
import BaseScene from '#/components/base/base-scene.component';
import BaseSceneTitle from '#/components/base/base-scene-title.component';
import BaseTypography from '#/components/base/base-typography.component';
import CartCheckoutSummary from '#/components/cart/cart-checkout-summary.component';
import CheckoutShippingAddress from '#/components/checkout/checkout-shipping-address.component';
import CheckoutItemList from '#/components/checkout/checkout-item-list.component';
import CheckoutForm from '#/components/checkout/checkout-form.component';

import type { PaymentIntent, StripeElementsOptions } from '@stripe/stripe-js';
import { useBoundStore } from '#/hooks/use-store.hook';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

const animateAddress = {
  initial: { outlineColor: 'rgba(0,255,0,1)' },
  animate: { outlineColor: 'rgba(0,255,0,0)' },
  transition: { duration: 1, ease: 'linear' },
};

const CheckoutPage = () => {
  const router = useRouter();
  const orderId = useBoundStore((state) => state.orderId);

  const { initialLoading: userAccountInitalLoading, currentUserAccount } =
    useCurrentUserAccount();

  const [openPayment, setOpenPayment] = useState(false);

  const {
    loading: checkoutLoading,
    piClientSecret,
    checkoutCartItems,
    cartItemCount,
    shippingAddress,
    shippingFee,
    subTotalAmount,
    totalAmount,
    changeShippingAddress,
    placeOrder,
    completeOrder,
  } = useCheckout();

  const {
    initialLoading: addressInitialLoading,
    loading: addressLoading,
    addresses,
    countries,
    addAddress,
    updateAddress,
  } = useAddress();

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: piClientSecret,
      appearance: { theme: 'night' },
    }),
    [piClientSecret],
  );

  useEffect(() => {
    if (!piClientSecret && !orderId) {
      router.push('/cart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [piClientSecret, orderId]);

  // If no shipping address then set the default address as the shipping address
  useEffect(() => {
    if (!!shippingAddress || !addresses || !addresses.length) {
      return;
    }

    const defaultAddress =
      addresses.find((address) => address.isDefault) || addresses[0];

    changeShippingAddress(defaultAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress, addresses, changeShippingAddress]);

  const handlePlaceOrder = useCallback(async () => {
    try {
      const result = await placeOrder();

      if (!result) {
        return;
      }

      setOpenPayment(true);
    } catch (error) {
      toast.error('An error occured!');
    }
  }, [placeOrder]);

  const handleCompleteOrder = useCallback(
    async (paymentIntent?: PaymentIntent) => {
      if (!paymentIntent || !currentUserAccount) {
        return;
      }

      await completeOrder(paymentIntent, currentUserAccount, '/order/success');
    },
    [completeOrder, currentUserAccount],
  );

  return (
    <>
      <BaseScene
        className='relative'
        loading={
          checkoutLoading || addressInitialLoading || userAccountInitalLoading
        }
      >
        {!!currentUserAccount && (
          <div className='mx-auto max-w-compact py-8 px-4 w-fit'>
            <BaseSceneTitle>Checkout</BaseSceneTitle>
            <div className='grid grid-flow-col auto-cols-max gap-4 w-full'>
              <BaseSurface className='w-[350px] h-[450px]'>
                <BaseTypography
                  className='pt-6 pb-4 px-8 block text-base font-normal'
                  variant='h4'
                >
                  {checkoutCartItems.length} Items
                </BaseTypography>
                <CheckoutItemList
                  className='h-[calc(100%-64px)] pb-6 pr-1'
                  cartItems={checkoutCartItems}
                />
              </BaseSurface>
              <motion.div
                key={shippingAddress?.id}
                className='rounded-lg outline outline-2'
                {...animateAddress}
              >
                <BaseSurface className='py-6 px-8 w-[350px] h-[450px] flex flex-col justify-between'>
                  <BaseTypography
                    className='block mb-4 text-base font-normal'
                    variant='h4'
                  >
                    Shipping Address{' '}
                  </BaseTypography>
                  <CheckoutShippingAddress
                    currentShippingAddress={shippingAddress}
                    addresses={addresses || []}
                    userAccount={currentUserAccount}
                    countries={countries || []}
                    disabled={addressLoading}
                    onAddAddress={addAddress}
                    onUpdateAddress={updateAddress}
                    onChangeShippingAddress={changeShippingAddress}
                  />
                </BaseSurface>
              </motion.div>
              <BaseSurface className='py-6 px-8 w-[350px] h-[450px] flex flex-col justify-between'>
                <BaseTypography
                  className='block mb-4 text-base font-normal'
                  variant='h4'
                >
                  Order Summary
                </BaseTypography>
                <CartCheckoutSummary
                  cartItemCount={cartItemCount}
                  shippingFee={shippingFee}
                  subTotalAmount={subTotalAmount}
                  totalAmount={totalAmount}
                  submitButtonLabel='Place Order'
                  onSubmit={handlePlaceOrder}
                />
              </BaseSurface>
            </div>
          </div>
        )}
      </BaseScene>
      <BaseDialog
        open={openPayment}
        handler={() => setOpenPayment(!openPayment)}
      >
        {!!piClientSecret && (
          <BaseSurface>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm
                email={currentUserAccount?.email}
                disabled={checkoutLoading}
                onComplete={handleCompleteOrder}
              />
            </Elements>
          </BaseSurface>
        )}
      </BaseDialog>
    </>
  );
};

export default CheckoutPage;
