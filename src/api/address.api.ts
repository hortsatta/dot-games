import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#/types/database.type';
import type { Address, CountryOption } from '#/types/address.type';
import type { FormData } from '#/components/user-account/user-account-address-upsert-form';

export async function getAddressesByUserId(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Address[]> {
  try {
    const { data, error } = await supabase
      .from('address')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return camelcaseKeys(data);
  } catch (error) {
    throw error;
  }
}

export async function updateAddress(
  supabase: SupabaseClient<Database>,
  address: Address,
): Promise<Address> {
  try {
    const { id, ...moreAddress } = address;
    const { data, error } = await supabase
      .from('address')
      .update(snakecaseKeys(moreAddress))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return camelcaseKeys(data);
  } catch (error) {
    throw error;
  }
}

export async function addAddress(
  supabase: SupabaseClient<Database>,
  formData: FormData,
): Promise<Address> {
  try {
    const addressDb = snakecaseKeys(formData);
    const { data, error } = await supabase
      .from('address')
      .insert(addressDb)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return camelcaseKeys(data);
  } catch (error) {
    throw error;
  }
}

export async function removeAddress(
  supabase: SupabaseClient<Database>,
  id: number,
): Promise<boolean> {
  try {
    const { error } = await supabase.from('address').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

export async function setDefaultAddress(
  supabase: SupabaseClient<Database>,
  address: Address,
): Promise<boolean> {
  try {
    await supabase
      .from('address')
      .update({ is_default: false })
      .eq('user_id', address.userId);

    await supabase
      .from('address')
      .update({ is_default: true })
      .eq('id', address.id);

    return true;
  } catch (error) {
    throw error;
  }
}

export async function getAllCountries(): Promise<CountryOption[]> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_COUNTRIES_API_URL || '');
    const countries = await res.json();

    return countries.data
      .map((country: any) => ({
        code: country.iso2,
        name: country.country,
      }))
      .sort((a: CountryOption, b: CountryOption) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });
  } catch (error) {
    throw error;
  }
}
