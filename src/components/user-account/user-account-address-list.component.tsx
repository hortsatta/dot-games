'use client';

import { memo, useCallback, useMemo, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Tooltip } from '@material-tailwind/react';

import { useTimeout } from '#/hooks/use-timeout.hook';
import BaseIcon from '../base/base-icon.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseDialog from '../base/base-dialog.component';
import BaseTypography from '../base/base-typography.component';
import UserAccountAddressCard from './user-account-address-card.component';
import UserAccountAddressUpsertForm from './user-account-address-upsert-form';

import type { ComponentProps } from 'react';
import type { IconButtonProps } from '@material-tailwind/react';
import type { UserAccount } from '#/types/user-account.type';
import type { Address, CountryOption } from '#/types/address.type';
import type { FormData } from '#/components/user-account/user-account-address-upsert-form';

type Props = ComponentProps<'div'> & {
  userAccount: UserAccount;
  countries: CountryOption[];
  addresses: Address[];
  disabled?: boolean;
  onAddAddress?: (data: FormData) => Promise<Address | null>;
  onUpdateAddress?: (data: Address) => Promise<Address | null>;
  onRemoveAddress?: (id: number) => Promise<boolean>;
  onSetDefaultAddress?: (address: Address) => Promise<boolean>;
};

const CARD_WIDTH = 300;
const CARD_GAP = 16;
const iconCardProps = { className: 'fill-primary', width: 36, height: 36 };
const iconButtonScrollProps = {
  color: 'white' as IconButtonProps['color'],
  variant: 'outlined' as IconButtonProps['variant'],
  size: 'sm' as IconButtonProps['size'],
  round: true,
  iconProps: { width: 16, height: 16 },
};
const animateAddress = {
  initial: { outlineColor: 'rgba(0,255,0,1)' },
  animate: { outlineColor: 'rgba(0,255,0,0)' },
  transition: { duration: 1, ease: 'linear' },
};

const UserAccountAddressList = memo(function UserAccountAddressList({
  userAccount,
  countries,
  addresses,
  disabled,
  onAddAddress = () => new Promise((resolve) => resolve(null)),
  onUpdateAddress = () => new Promise((resolve) => resolve(null)),
  onRemoveAddress,
  onSetDefaultAddress,
}: Props) {
  const scrollableNodeRef = useRef<any>(null);
  const { timeoutFn: delayedAddAddress } = useTimeout(onAddAddress);
  const { timeoutFn: delayedUpdateAddress } = useTimeout(onUpdateAddress);

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.isDefault),
    [addresses],
  );

  const moreAddresses = useMemo(
    () => addresses.filter((address) => !address.isDefault),
    [addresses],
  );

  const [openUpsertAddress, setOpenUpsertAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const scrollToLeft = useCallback(() => {
    !!scrollableNodeRef.current &&
      scrollableNodeRef.current.scrollBy({
        left: -(CARD_WIDTH + CARD_GAP),
        top: 0,
        behavior: 'smooth',
      });
  }, []);

  const scrollToRight = useCallback(() => {
    !!scrollableNodeRef.current &&
      scrollableNodeRef.current.scrollBy({
        left: CARD_WIDTH + CARD_GAP,
        top: 0,
        behavior: 'smooth',
      });
  }, []);

  const handleOpenUpsertAddress = useCallback(() => {
    if (loading) {
      return;
    }

    setOpenUpsertAddress(!openUpsertAddress);
    if (!openUpsertAddress) {
      setIsComplete(false);
    }
  }, [loading, openUpsertAddress]);

  const handleEditCard = useCallback(
    (address: Address) => {
      handleOpenUpsertAddress();
      setSelectedAddress(address);
    },
    [handleOpenUpsertAddress],
  );

  const handleAddNew = useCallback(() => {
    handleOpenUpsertAddress();
    setSelectedAddress(undefined);
  }, [handleOpenUpsertAddress]);

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
          setOpenUpsertAddress(false);
          setIsComplete(true);
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
    [delayedAddAddress, delayedUpdateAddress],
  );

  const handleRemoveAddress = useCallback(async () => {
    if (!onRemoveAddress || !selectedAddress) {
      return;
    }

    setLoading(true);
    const result = await onRemoveAddress(selectedAddress.id);

    if (result) {
      setOpenUpsertAddress(false);
    } else {
      toast.error('Cannot remove address. Please try again later');
    }

    setLoading(false);
  }, [onRemoveAddress, selectedAddress]);

  return (
    <>
      <div className='flex items-center'>
        <div className='mr-4 flex items-start'>
          <div className='relative mr-4 min-w-[300px] min-h-[452px]'>
            <div className='absolute top-0 left-0'>
              <BaseTypography className='pl-2 mt-2 mb-2 text-sm '>
                Default Address
              </BaseTypography>
              <AnimatePresence>
                {!!defaultAddress ? (
                  <motion.div
                    key={defaultAddress.id}
                    className='rounded-xl outline outline-2'
                    {...animateAddress}
                  >
                    <UserAccountAddressCard
                      address={defaultAddress}
                      disabled={disabled}
                      onEdit={() => handleEditCard(defaultAddress)}
                    />
                  </motion.div>
                ) : (
                  <div className='flex justify-center items-center w-[300px] h-[400px] bg-surface rounded-xl'>
                    <BaseIcon
                      name='selection-slash'
                      className='opacity-50'
                      width={56}
                      height={56}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div>
            <div className='flex justify-between items-end mb-2'>
              <BaseTypography className='pl-2 text-sm'>
                Other Addresses
              </BaseTypography>
              <div className='flex items-center'>
                <BaseIconButton
                  name='caret-left'
                  aria-label='previous item'
                  className='mr-2 w-7 h-7'
                  onClick={scrollToLeft}
                  {...iconButtonScrollProps}
                />
                <BaseIconButton
                  name='caret-right'
                  aria-label='next item'
                  className='w-7 h-7'
                  onClick={scrollToRight}
                  {...iconButtonScrollProps}
                />
              </div>
            </div>
            <SimpleBar
              className='w-[616px] pb-4 overflow-y-hidden'
              scrollableNodeProps={{ ref: scrollableNodeRef }}
            >
              <div className='grid grid-flow-col auto-cols-max gap-4 w-full'>
                {moreAddresses.map((address) => (
                  <UserAccountAddressCard
                    key={address.id}
                    address={address}
                    disabled={disabled}
                    onEdit={() => handleEditCard(address)}
                    onSetDefault={onSetDefaultAddress}
                  />
                ))}
              </div>
            </SimpleBar>
          </div>
        </div>
        <Tooltip content='add new address'>
          <BaseIconButton
            name='plus'
            aria-label='add new address'
            className='max-w-none max-h-none w-[65px] h-[65px] rounded-full'
            variant='outlined'
            iconProps={iconCardProps}
            onClick={handleAddNew}
          />
        </Tooltip>
      </div>
      <BaseDialog
        className='overflow-visible'
        open={openUpsertAddress}
        handler={handleOpenUpsertAddress}
      >
        <UserAccountAddressUpsertForm
          userAccount={userAccount}
          countries={countries}
          address={selectedAddress}
          isComplete={isComplete}
          disabled={disabled}
          onSubmit={handleUpsertSubmit}
          onRemove={handleRemoveAddress}
        />
      </BaseDialog>
    </>
  );
});

export default UserAccountAddressList;
