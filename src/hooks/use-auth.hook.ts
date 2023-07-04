import { useCallback } from 'react';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';

import { createCart } from '#/api/cart.api';
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
} from '#/api/auth.api';

import type { AuthCredentials } from '#/types/auth.type';
import type { FormData as SignUpFormdata } from '#/components/auth/auth-sign-up-form.component';

type Result = {
  signIn: (authCredentials: AuthCredentials) => Promise<boolean>;
  signUp: (formData: SignUpFormdata) => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

export const useAuth = (): Result => {
  const { supabase } = useSupabase();
  const cart = useBoundStore((state) => state.cart);
  const setCart = useBoundStore((state) => state.setCart);

  const signIn = useCallback(
    async ({ email, password }: AuthCredentials) =>
      authSignIn(supabase, { email, password }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authSignIn],
  );

  const signUp = useCallback(
    async ({
      email,
      password,
      fullName,
      displayName,
    }: Omit<SignUpFormdata, 'confirmPassword'>) => {
      try {
        const userId = await authSignUp(supabase, {
          email,
          password,
          fullName,
          displayName,
        });

        if (!!cart?.cartItems.length && !!userId) {
          await createCart(supabase, userId.trim(), cart.cartItems);
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authSignUp],
  );

  const signOut = useCallback(
    async () => {
      await authSignOut(supabase);
      setCart();
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authSignOut],
  );

  return {
    signIn,
    signUp,
    signOut,
  };
};
