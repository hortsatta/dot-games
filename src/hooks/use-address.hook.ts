import { useCallback, useEffect, useState } from 'react';

import {
  getAddressesByUserId,
  updateAddress as updateAddressDb,
  addAddress as addAddressDb,
  setDefaultAddress as setDefaultAddressDb,
  removeAddress as removeAddressDb,
  getAllCountries,
} from '#/api/address.api';
import { useSupabase } from '#/components/core/core-supabase-provider';
import { useBoundStore } from './use-store.hook';

import type { Address, CountryOption } from '#/types/address.type';
import type { FormData } from '#/components/user-account/user-account-address-upsert-form';

type Result = {
  initialLoading: boolean;
  loading: boolean;
  countries: CountryOption[] | undefined;
  addresses: Address[] | undefined;
  addAddress: (address: FormData) => Promise<boolean>;
  updateAddress: (address: Address) => Promise<boolean>;
  removeAddress: (id: number) => Promise<boolean>;
  setDefaultAddress: (address: Address) => Promise<boolean>;
};

export const useAddress = (): Result => {
  const { supabase } = useSupabase();
  const currentUserId = useBoundStore((state) => state.currentUserId);
  const [addresses, setAddresses] = useState<Address[] | undefined>(undefined);
  const [countries, setCountries] = useState<CountryOption[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAddresses = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    try {
      const currentAddresses = await getAddressesByUserId(
        supabase,
        currentUserId,
      );
      setAddresses(currentAddresses);
    } catch (error) {
      setAddresses([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const addAddress = useCallback(
    async (address: FormData) => {
      setLoading(true);
      try {
        await addAddressDb(supabase, address);
        await fetchAddresses();
        return true;
      } catch (error) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchAddresses],
  );

  const updateAddress = useCallback(
    async (address: Address) => {
      setLoading(true);
      try {
        await updateAddressDb(supabase, address);
        await fetchAddresses();
        return true;
      } catch (error) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchAddresses],
  );

  const removeAddress = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        await removeAddressDb(supabase, id);
        await fetchAddresses();
        return true;
      } catch (error) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchAddresses],
  );

  const setDefaultAddress = useCallback(
    async (address: Address) => {
      setLoading(true);
      try {
        await setDefaultAddressDb(supabase, address);
        await fetchAddresses();
        return true;
      } catch (error) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchAddresses],
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (error) {
        setCountries([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchAddresses();
    })();
  }, [currentUserId, fetchAddresses]);

  return {
    initialLoading: addresses === undefined || countries === undefined,
    loading,
    countries,
    addresses,
    addAddress,
    removeAddress,
    updateAddress,
    setDefaultAddress,
  };
};
