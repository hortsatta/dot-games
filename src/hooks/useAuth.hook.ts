import { useCallback } from 'react';
import { useSupabase } from '#/components/core/core-supabase-provider';
import type { AuthCredentials } from '#/types/auth.type';

type Result = {
  signIn: (authCredentials: AuthCredentials) => Promise<boolean>;
  signUp: () => boolean;
  signOut: () => void;
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

  const signUp = () => {
    // await supabase.auth.signUp({
    //   email: "jon@supabase.com",
    //   password: "sup3rs3cur3",
    // });
    return true;
  };

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
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
