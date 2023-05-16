import { useCallback } from 'react';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';

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
  const setCart = useBoundStore((state) => state.setCart);

  const signIn = useCallback(
    async ({ email, password }: AuthCredentials) =>
      authSignIn(supabase, { email, password }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authSignIn],
  );

  const signUp = useCallback(
    ({
      email,
      password,
      fullName,
      displayName,
    }: Omit<SignUpFormdata, 'confirmPassword'>) =>
      authSignUp(supabase, { email, password, fullName, displayName }),
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
