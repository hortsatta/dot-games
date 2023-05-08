'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import { useStore } from '#/hooks/useStore.hook';

import type { ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '#/types/database/database.type';

type Props = {
  children: ReactNode;
};

const Context = createContext<
  { supabase: SupabaseClient<Database> } | undefined
>(undefined);

const CoreSupabaseProvider = ({ children }: Props) => {
  const router = useRouter();
  const setCurrentUserId = useStore((state) => state.setCurrentUserId);
  const [supabase] = useState(() =>
    createBrowserSupabaseClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }),
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const currentUserId = session?.user.id || null;
      setCurrentUserId(currentUserId);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
};

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};

export default CoreSupabaseProvider;
