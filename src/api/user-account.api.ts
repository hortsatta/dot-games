import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { UserAccount } from '#/types/user-account.type';
import snakecaseKeys from 'snakecase-keys';

export async function updateUserAccount(
  supabase: SupabaseClient<Database>,
  userAccount: UserAccount,
): Promise<boolean> {
  try {
    const { userId, ...moreUserAccount } = userAccount;
    const row = snakecaseKeys(moreUserAccount);

    const { error } = await supabase
      .from('user_account')
      .update(row)
      .eq('user_id', userId)
      .select()
      .single();

    return !error;
  } catch (error) {
    throw error;
  }
}
