'use client';

import { memo, useCallback, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseTypography from '../base/base-typography.component';
import UserAccountAddressCard from '../user-account/user-account-address-card.component';

import type { ComponentProps } from 'react';
import type { IconButtonProps } from '@material-tailwind/react';
import type { Address } from '#/types/address.type';

type Props = Omit<ComponentProps<'div'>, 'onSubmit'> & {
  currentShippingAddress: Address | null;
  addresses: Address[];
  loading?: boolean;
  onSubmit?: (address: Address) => void;
  onAddNew?: () => void;
};

const CARD_WIDTH = 300;
const CARD_GAP = 8;
const iconButtonScrollProps = {
  color: 'white' as IconButtonProps['color'],
  variant: 'outlined' as IconButtonProps['variant'],
  size: 'sm' as IconButtonProps['size'],
  round: true,
  iconProps: { width: 16, height: 16 },
};

const CheckoutShippingAddressSelector = memo(
  function CheckoutShippingAddressSelector({
    className,
    currentShippingAddress,
    addresses,
    loading,
    onSubmit,
    onAddNew,
  }: Props) {
    const scrollableNodeRef = useRef<any>(null);
    const [selectedAddress, setSelectedAddress] = useState(
      currentShippingAddress,
    );

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

    const handleSelectAddress = useCallback(() => {
      if (!selectedAddress || !onSubmit) {
        return;
      }

      onSubmit(selectedAddress);
    }, [selectedAddress, onSubmit]);

    return (
      <div className={cx('px-6 pt-4 pb-6', className)}>
        <BaseTypography
          className='mb-4 text-lg font-medium text-center'
          variant='h4'
        >
          Change Shipping Address
        </BaseTypography>
        <div className='w-full flex justify-end items-center'>
          <BaseIconButton
            name='caret-left'
            className='mr-2 w-7 h-7'
            onClick={scrollToLeft}
            {...iconButtonScrollProps}
          />
          <BaseIconButton
            name='caret-right'
            className='w-7 h-7'
            onClick={scrollToRight}
            {...iconButtonScrollProps}
          />
        </div>
        <SimpleBar
          className='w-full pb-4 overflow-y-hidden'
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <div className='pt-2 grid grid-flow-col auto-cols-max gap-2 w-full'>
            {addresses.map((address) => (
              <button
                key={address.id}
                className={cx(
                  'text-left rounded-xl border border-2 border-transparent hover:!border-primary transition-[border]',
                  address.id === selectedAddress?.id && '!border-primary',
                )}
                disabled={loading}
                onClick={() => setSelectedAddress(address)}
              >
                <UserAccountAddressCard
                  className={cx(
                    address.id === selectedAddress?.id && '!bg-primary/10',
                  )}
                  isSelected={address.id === currentShippingAddress?.id}
                  address={address}
                  defaultIconHidden
                />
              </button>
            ))}
          </div>
        </SimpleBar>
        <div className='mt-4 h-[40px] w-full flex'>
          <BaseButton
            className='mr-2 flex-1 h-full'
            disabled={loading}
            variant='outlined'
            onClick={() => onAddNew && onAddNew()}
            fullWidth
          >
            New Address
          </BaseButton>
          <BaseButton
            className='flex-1 h-full'
            loading={loading}
            onClick={handleSelectAddress}
            fullWidth
          >
            Select Address
          </BaseButton>
        </div>
      </div>
    );
  },
);

export default CheckoutShippingAddressSelector;
