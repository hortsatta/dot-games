import { useEffect, useState } from 'react';
import camelcaseKeys from 'camelcase-keys';

import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';

import type { UserAccount } from '#/types/user-account.type';

type Result = {
  currentUserAccount: UserAccount | null | undefined;
};

export const useCurrentUserAccount = (): Result => {
  const { supabase } = useSupabase();
  const currentUserId = useBoundStore((state) => state.currentUserId);
  const [currentUserAccount, setCurrentUserAccount] = useState<
    UserAccount | null | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      try {
        if (currentUserId == null) {
          setCurrentUserAccount(currentUserId);
          return;
        }

        const { data, error } = await supabase
          .from('user_account')
          .select()
          .eq('user_id', currentUserId)
          .single();

        if (!data || !!error) {
          setCurrentUserAccount(null);
          return;
        }

        setCurrentUserAccount(camelcaseKeys(data) as UserAccount);
      } catch (error) {
        setCurrentUserAccount(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  return { currentUserAccount };
};
