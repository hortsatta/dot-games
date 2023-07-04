import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';
import Stripe from 'stripe';

import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '#/types/database.type';
import type { CartItem } from '#/types/cart.type';

// Initialize stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export async function POST(request: Request) {
  const currentDateSeconds = new Date().getTime() / 1000;
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const { data: authData } = await supabase.auth.getSession();
  const { cartItems, cartId } = await request.json();

  if (!authData || (authData.session?.expires_at || 0) < currentDateSeconds) {
    return NextResponse.json({ error: 'Session not found' }, { status: 401 });
  } else if (!cartItems || !cartItems.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  try {
    // Calculate total amount and create stripe payment intent,
    // save client secret to db and return it
    const amount = await calculateTotalAmount(supabase, cartItems);
    const { data: cartData } = await supabase
      .from('cart')
      .select()
      .eq('id', cartId)
      .single();

    if (!cartData) {
      return NextResponse.json(
        { error: 'Cart does not exist' },
        { status: 400 },
      );
    }

    let piClientSecret = null;
    if (!!cartData?.payment_intent_id) {
      piClientSecret = await updatePaymentIntent(
        amount,
        cartData.payment_intent_id,
      );
    } else {
      piClientSecret = await createPaymentIntent(supabase, amount, cartData.id);
    }

    return NextResponse.json({ pi_client_secret: piClientSecret });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

async function createPaymentIntent(
  supabase: SupabaseClient<Database>,
  amount: number,
  cartId: number,
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  await supabase
    .from('cart')
    .update({ payment_intent_id: paymentIntent.id })
    .eq('id', cartId)
    .select()
    .single();

  return paymentIntent.client_secret;
}

async function updatePaymentIntent(amount: number, paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
    amount,
  });
  return paymentIntent.client_secret;
}

async function calculateTotalAmount(
  supabase: SupabaseClient<Database>,
  items: CartItem[],
) {
  const ids = items.map((item) => item.gameProductId);
  const { data: gameProductData } = await supabase
    .from('game_product')
    .select()
    .is('is_active', true)
    .in('id', ids);

  const amount = items.reduce((total, current) => {
    const gameProduct = gameProductData?.find(
      (gpd) => gpd.id === current.gameProductId,
    );

    if (!gameProduct) {
      return total;
    }

    const discount =
      gameProduct.discount > 0
        ? Math.min(Math.max(gameProduct.discount, 0), 100)
        : 0;

    const finalPrice = Number(
      !!discount
        ? (gameProduct.price * ((100 - discount) / 100)).toFixed(2)
        : gameProduct.price.toFixed(2),
    );

    return total + finalPrice * current.quantity;
  }, 0);

  return Math.round(amount * 100);
}
