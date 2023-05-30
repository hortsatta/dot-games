'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { Card, CardBody } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseDivider from '../base/base-divider.component';
import BaseIcon from '../base/base-icon.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseTypography from '../base/base-typography.component';

import type { ComponentProps } from 'react';
import type { Address } from '#/types/address.type';

type Props = Omit<ComponentProps<typeof Card>, 'children'> & {
  address: Address;
  disabled?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  onSetDefault?: (address: Address) => Promise<boolean>;
};

const WRAPPER_CLASSNAME = 'mb-3';
const VALUE_CLASSNAME = 'text-base leading-none';
const DIVIDER_CLASSNAME = '!my-1 opacity-50';
const labelProps = { className: 'opacity-50', variant: 'small' };
const iconProps = { className: 'fill-primary' };

const UserAccountAddressCard = memo(function UserAccountAddressCard({
  className,
  address,
  disabled,
  onEdit,
  onSetDefault,
  ...moreProps
}: Props) {
  const [loading, setLoading] = useState(false);

  const fullName = useMemo(() => address.fullName, [address]);
  const phoneNumber = useMemo(() => address.phoneNumber, [address]);
  const addressLine = useMemo(() => address.addressLine, [address]);
  const city = useMemo(() => address.city, [address]);
  const country = useMemo(() => address.country, [address]);
  const zipCode = useMemo(() => address.zipCode, [address]);

  const handleSetDefaultAddress = useCallback(async () => {
    if (!onSetDefault) {
      return;
    }

    setLoading(true);
    await onSetDefault(address);
    setLoading(false);
  }, [address, onSetDefault]);

  return (
    <Card
      className={cx('relative w-[300px] bg-surface', className)}
      {...moreProps}
    >
      <CardBody className='pt-9 pb-4'>
        <div className='absolute top-2 right-2 flex items-center'>
          {address.isDefault && (
            <BaseIcon
              name='check-circle'
              className='mx-2 fill-green-500'
              width={24}
              height={24}
            />
          )}
          {!!onSetDefault && !address.isDefault && (
            <BaseIconButton
              name='map-pin-line'
              variant='text'
              loading={loading}
              disabled={!loading && disabled}
              iconProps={iconProps}
              onClick={handleSetDefaultAddress}
            />
          )}
          {!!onEdit && (
            <BaseIconButton
              name='pencil-simple'
              variant='text'
              disabled={disabled}
              iconProps={iconProps}
              onClick={onEdit}
            />
          )}
        </div>
        <div className={WRAPPER_CLASSNAME}>
          <BaseTypography className={cx(VALUE_CLASSNAME, 'pr-14')}>
            {fullName}
          </BaseTypography>
          <BaseDivider className={DIVIDER_CLASSNAME} />
          <BaseTypography {...labelProps}>Full Name</BaseTypography>
        </div>
        <div className={WRAPPER_CLASSNAME}>
          <BaseTypography className={VALUE_CLASSNAME}>
            {phoneNumber}
          </BaseTypography>
          <BaseDivider className={DIVIDER_CLASSNAME} />
          <BaseTypography {...labelProps}>Phone</BaseTypography>
        </div>
        <div className={WRAPPER_CLASSNAME}>
          <BaseTypography className={VALUE_CLASSNAME}>
            {addressLine}
          </BaseTypography>
          <BaseDivider className={DIVIDER_CLASSNAME} />
          <BaseTypography className='opacity-50 line-clamp-1' variant='small'>
            Address Line 1
          </BaseTypography>
        </div>
        <div className={WRAPPER_CLASSNAME}>
          <BaseTypography className={VALUE_CLASSNAME}>{city}</BaseTypography>
          <BaseDivider className={DIVIDER_CLASSNAME} />
          <BaseTypography {...labelProps}>City</BaseTypography>
        </div>
        <div className={WRAPPER_CLASSNAME}>
          <BaseTypography className={VALUE_CLASSNAME}>{country}</BaseTypography>
          <BaseDivider className={DIVIDER_CLASSNAME} />
          <BaseTypography {...labelProps}>Country</BaseTypography>
        </div>
        <div className={WRAPPER_CLASSNAME}>
          <BaseTypography className={VALUE_CLASSNAME}>{zipCode}</BaseTypography>
          <BaseDivider className={DIVIDER_CLASSNAME} />
          <BaseTypography {...labelProps}>Zip Code</BaseTypography>
        </div>
      </CardBody>
    </Card>
  );
});

export default UserAccountAddressCard;
