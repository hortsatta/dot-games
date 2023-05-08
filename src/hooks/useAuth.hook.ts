import { useCallback } from 'react';
import { useSupabase } from '#/components/core/core-supabase-provider';

import type { AuthCredentials } from '#/types/auth.type';
import type { FormData as SignUpFormdata } from '#/components/auth/auth-sign-up-form.component';

type Result = {
  signIn: (authCredentials: AuthCredentials) => Promise<boolean>;
  signUp: (formData: SignUpFormdata) => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

export const useAuth = (): Result => {
  const { supabase } = useSupabase();

  const signIn = useCallback(
    async ({ email, password }: AuthCredentials) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return !error;
      } catch (error) {
        throw error;
      }
    },
    [supabase],
  );

  const signUp = useCallback(
    async ({
      email,
      password,
      fullName: full_name,
      displayName: display_name,
    }: SignUpFormdata) => {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
          },
        );

        // Check if there is an error or user is null,
        // otherwise get user id and insert into user_account table
        if (!!authError || !authData.user) {
          return false;
        }

        const user_id = authData.user.id;
        const { error } = await supabase
          .from('user_account')
          .insert({ user_id, display_name, full_name, avatar_type: 1 });

        return !error;
      } catch (error) {
        throw error;
      }
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return !error;
    } catch (error) {
      throw error;
    }
  }, [supabase]);

  return {
    signIn,
    signUp,
    signOut,
  };
};
