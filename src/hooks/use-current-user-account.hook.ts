import { useCallback, useEffect, useState } from 'react';

import { getCurrentUserAccount } from '#/api/auth.api';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';

import type { UserAccount } from '#/types/user-account.type';

type Result = {
  initialLoading: boolean;
  currentUserAccount: UserAccount | null | undefined;
};

export const useCurrentUserAccount = (): Result => {
  const { supabase } = useSupabase();
  const currentUserId = useBoundStore((state) => state.currentUserId);
  const refreshUserAccount = useBoundStore((state) => state.refreshCurrentUser);
  const setRefreshCurrentUser = useBoundStore(
    (state) => state.setRefreshCurrentUser,
  );
  const [currentUserAccount, setCurrentUserAccount] = useState<
    UserAccount | null | undefined
  >(undefined);

  const getUserAccount = useCallback(async () => {
    const userAccount = await getCurrentUserAccount(supabase);
    setCurrentUserAccount(userAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (currentUserId == null) {
        setCurrentUserAccount(currentUserId);
        return;
      }
      await getUserAccount();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  useEffect(() => {
    (async () => {
      if (!refreshUserAccount) {
        return;
      }

      await getUserAccount();
      setRefreshCurrentUser(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshUserAccount]);

  return {
    initialLoading: currentUserAccount === undefined,
    currentUserAccount,
  };
};
