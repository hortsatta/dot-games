'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { cx } from 'classix';

import { useTimeout } from '#/hooks/use-timeout.hook';
import BaseButton from '../base/base-button.component';
import BaseDialog from '../base/base-dialog.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseTypography from '../base/base-typography.component';
import CheckoutShippingAddressSelector from './checkout-shipping-address-selector.component';
import UserAccountAddressUpsertForm from '../user-account/user-account-address-upsert-form';

import type { ComponentProps } from 'react';
import type { Address, CountryOption } from '#/types/address.type';
import type { UserAccount } from '#/types/user-account.type';
import type { FormData } from '#/components/user-account/user-account-address-upsert-form';

type Props = ComponentProps<'div'> & {
  currentShippingAddress: Address | null;
  addresses: Address[];
  userAccount: UserAccount;
  countries: CountryOption[];
  disabled?: boolean;
  onAddAddress?: (data: FormData) => Promise<Address | null>;
  onUpdateAddress?: (data: Address) => Promise<Address | null>;
  onChangeShippingAddress?: (address: Address) => void;
};

const VALUE_CLASSNAME = '!mb-2';

const CheckoutShippingAddress = memo(function CheckoutShippingAddress({
  className,
  currentShippingAddress,
  addresses,
  userAccount,
  countries,
  disabled,
  onAddAddress = () => new Promise((resolve) => resolve(null)),
  onUpdateAddress = () => new Promise((resolve) => resolve(null)),
  onChangeShippingAddress = () => null,
  ...moreProps
}: Props) {
  const { timeoutFn: delayedAddAddress }: any = useTimeout(onAddAddress);
  const { timeoutFn: delayedChangeShippingAddress } = useTimeout(
    onChangeShippingAddress,
  );
  const { timeoutFn: delayedUpdateAddress } = useTimeout(onUpdateAddress);

  const [isUpsert, setIsUpsert] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined,
  );
  const [openAddressSelect, setOpenAddressSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpsertComplete, setIsUpsertComplete] = useState(false);

  const fullName = useMemo(
    () => currentShippingAddress?.fullName,
    [currentShippingAddress],
  );
  const addressLine = useMemo(
    () => currentShippingAddress?.addressLine,
    [currentShippingAddress],
  );
  const city = useMemo(
    () => currentShippingAddress?.city,
    [currentShippingAddress],
  );
  const country = useMemo(
    () => currentShippingAddress?.country,
    [currentShippingAddress],
  );
  const zipCode = useMemo(
    () => currentShippingAddress?.zipCode,
    [currentShippingAddress],
  );
  const phoneNumber = useMemo(
    () => currentShippingAddress?.phoneNumber,
    [currentShippingAddress],
  );

  const sortedAddresses = useMemo(() => {
    if (!currentShippingAddress) {
      return addresses;
    }

    return addresses.sort((a) => {
      if (a.id === currentShippingAddress.id) {
        return -1;
      }

      return 0;
    });
  }, [currentShippingAddress, addresses]);

  const handleOpenAddressSelect = useCallback(() => {
    if (loading) {
      return;
    }

    setOpenAddressSelect(!openAddressSelect);

    if (!openAddressSelect) {
      setIsUpsertComplete(false);
      setIsUpsert(false);
    }
  }, [loading, openAddressSelect]);

  const handleAddNew = useCallback(() => {
    setIsUpsert(true);
    setSelectedAddress(undefined);
  }, []);

  const handleEdit = useCallback(() => {
    setIsUpsert(true);
    setIsUpsertComplete(false);
    setSelectedAddress(currentShippingAddress || undefined);
    setOpenAddressSelect(true);
  }, [currentShippingAddress]);

  const handleChangeShippingAddress = useCallback(
    async (address: Address) => {
      setLoading(true);
      await delayedChangeShippingAddress(address);
      setLoading(false);
      handleOpenAddressSelect();
    },
    [delayedChangeShippingAddress, handleOpenAddressSelect],
  );

  const handleUpsertSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true);
      let result = null;

      try {
        if (!data.id) {
          result = await delayedAddAddress(data);
        } else {
          result = await delayedUpdateAddress(data as Address);
        }

        if (result) {
          onChangeShippingAddress(result as Address);
          setOpenAddressSelect(false);
          setIsUpsertComplete(true);
        } else {
          toast.error(
            `Cannot ${
              !!data.id ? 'update' : 'add new'
            } address. Ensure that fields are populated properly`,
          );
        }
      } catch (error) {
        toast.error(
          `Cannot ${
            !!data.id ? 'update' : 'add new'
          } address. Please try again later`,
        );
      } finally {
        setLoading(false);
      }
    },
    [delayedAddAddress, delayedUpdateAddress, onChangeShippingAddress],
  );

  return (
    <>
      <div
        className={cx('flex-1 flex flex-col justify-between', className)}
        {...moreProps}
      >
        {!!currentShippingAddress && (
          <div>
            <BaseTypography className={VALUE_CLASSNAME} variant='paragraph'>
              {fullName}
            </BaseTypography>
            <BaseTypography className={VALUE_CLASSNAME} variant='paragraph'>
              {addressLine}, {city}, {zipCode}
            </BaseTypography>
            <BaseTypography className={VALUE_CLASSNAME} variant='paragraph'>
              {country}
            </BaseTypography>
            <BaseTypography className={VALUE_CLASSNAME} variant='paragraph'>
              {phoneNumber}
            </BaseTypography>
          </div>
        )}
        <div>
          <BaseButton
            className='mb-4'
            variant='outlined'
            onClick={handleEdit}
            fullWidth
          >
            Edit Current Address
          </BaseButton>
          <BaseButton
            variant='outlined'
            onClick={handleOpenAddressSelect}
            fullWidth
          >
            Change Address
          </BaseButton>
        </div>
      </div>
      <BaseDialog
        open={openAddressSelect}
        size={isUpsert ? 'xs' : 'md'}
        handler={handleOpenAddressSelect}
      >
        {isUpsert ? (
          <UserAccountAddressUpsertForm
            address={selectedAddress}
            userAccount={userAccount}
            countries={countries}
            isComplete={isUpsertComplete}
            disabled={disabled}
            onSubmit={handleUpsertSubmit}
          />
        ) : (
          <CheckoutShippingAddressSelector
            className='bg-backdrop border border-border rounded-xl'
            currentShippingAddress={currentShippingAddress}
            addresses={sortedAddresses}
            loading={loading}
            onAddNew={handleAddNew}
            onSubmit={handleChangeShippingAddress}
          />
        )}
      </BaseDialog>
    </>
  );
});

export default CheckoutShippingAddress;
