'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';

import type { ComponentProps, FormEvent } from 'react';
import type {
  PaymentIntent,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';

type Props = ComponentProps<'form'> & {
  onComplete: (paymentIntent?: PaymentIntent) => void;
  email?: string;
  disabled?: boolean;
};

const paymentElementOptions: StripePaymentElementOptions = {
  layout: {
    type: 'tabs',
    defaultCollapsed: false,
  },
};

const CheckoutForm = memo(function CheckoutForm({
  className,
  email,
  disabled,
  onComplete,
  ...moreProps
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const linkAuthElOptions = useMemo(
    () => (email ? { defaultValues: { email } } : undefined),
    [email],
  );

  useEffect(() => {
    (async () => {
      if (!stripe) {
        return;
      }

      const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret',
      );

      if (!clientSecret) {
        return;
      }

      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret,
      );

      switch (paymentIntent?.status) {
        case 'succeeded':
          toast.success('Payment succeeded!');
          break;
        case 'processing':
          toast.loading('Your payment is processing...');
          break;
        case 'requires_payment_method':
          toast.error('Your payment was not successful. Please try again');
          break;
        default:
          toast.error('Something went wrong');
          break;
      }
    })();
  }, [stripe]);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      setLoading(true);

      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (!!error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          toast.error(error.message || null);
        } else {
          toast.error('An error occurred');
        }
      }

      await onComplete(paymentIntent);

      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elements, stripe],
  );

  return (
    <form
      id='payment-form'
      className={cx('p-8', className)}
      onSubmit={handleSubmit}
      {...moreProps}
    >
      <LinkAuthenticationElement
        id='link-authentication-element'
        className='mb-2'
        options={linkAuthElOptions}
      />
      <PaymentElement
        id='payment-element'
        className='mb-6'
        options={paymentElementOptions}
      />
      <BaseButton
        type='submit'
        id='submit'
        className='m-h-[50px]'
        size='lg'
        loading={loading}
        disabled={!stripe || !elements}
        fullWidth
      >
        Pay Now
      </BaseButton>
    </form>
  );
});

export default CheckoutForm;
