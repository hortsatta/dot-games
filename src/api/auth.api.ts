import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthCredentials } from '#/types/auth.type';
import type { Database } from '#/types/database.type';
import type { FormData as SignUpFormdata } from '#/components/auth/auth-sign-up-form.component';

export async function signIn(
  supabase: SupabaseClient<Database>,
  { email, password }: AuthCredentials,
) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return !error;
  } catch (error) {
    throw error;
  }
}

export async function signUp(
  supabase: SupabaseClient<Database>,
  {
    email,
    password,
    fullName: full_name,
    displayName: display_name,
  }: Omit<SignUpFormdata, 'confirmPassword'>,
) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

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
}

export async function signOut(supabase: SupabaseClient<Database>) {
  try {
    const { error } = await supabase.auth.signOut();
    return !error;
  } catch (error) {
    throw error;
  }
}
