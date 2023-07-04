import { memo, useCallback, useMemo } from 'react';
import { Menu, MenuHandler } from '@material-tailwind/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseInput from '../base/base-input.component';
import BaseMenuList from '../base/base-menu-list.component';
import BaseMenuItem from '../base/base-menu-item.component';
import BaseSurface from '../base/base-surface.component';
import BaseSelect from '../base/base-select.component';
import BaseOption from '../base/base-option.component';

import BaseTypography from '../base/base-typography.component';

import type { ComponentProps } from 'react';
import type { Address, CountryOption } from '#/types/address.type';
import type { UserAccount } from '#/types/user-account.type';

export type FormData = Omit<
  Address,
  'id' | 'createdAt' | 'isActive' | 'isDefault'
> & {
  id?: number;
};

const removeIconButtonProps = { className: 'fill-primary' };

type Props = Omit<ComponentProps<'div'>, 'onSubmit'> & {
  userAccount: UserAccount;
  countries: CountryOption[];
  address?: Address;
  isComplete?: boolean;
  disabled?: boolean;
  onSubmit?: (data: FormData) => Promise<void>;
  onRemove?: () => Promise<void>;
};

const schema = z.object({
  id: z.number().positive().optional(),
  userId: z.string(),
  fullName: z.string().min(4, 'Name should be more than of 3 characters'),
  phoneNumber: z.string().min(6, 'Invalid phone number'),
  addressLine: z
    .string()
    .min(1, 'Address is required')
    .max(100, 'Invalid address'),
  country: z.string().min(1, 'Country is required').max(50, 'Invalid country'),
  city: z.string().min(1, 'City is required').max(50, 'Invalid city'),
  zipCode: z.number().int(),
});

const UserAccountAddressUpsertForm = memo(
  function UserAccountAddressUpsertForm({
    className,
    userAccount,
    countries,
    address,
    isComplete,
    disabled,
    onRemove,
    onSubmit = () => new Promise((resolve) => resolve()),
    ...moreProps
  }: Props) {
    const defaultValues: FormData = useMemo(() => {
      if (!!address) {
        const { createdAt, isActive, ...moreAddress } = address;
        return moreAddress;
      }

      return {
        userId: userAccount.userId || '',
        fullName: userAccount.fullName || '',
        phoneNumber: '',
        zipCode: undefined,
        addressLine: '',
        country: '',
        city: '',
      } as any;
    }, [userAccount, address]);

    const {
      control,
      register,
      setValue,
      formState: { errors, isSubmitting },
      handleSubmit,
    } = useForm({
      shouldFocusError: false,
      defaultValues,
      resolver: zodResolver(schema),
    });

    const submitBtnLabel = useMemo(
      () => `${!!address ? 'Update' : 'Add New'} Address`,
      [address],
    );

    const selectCountryValue = useCallback(
      (value: string | undefined) => {
        const country = countries.find(
          (c) => c.name.toLowerCase() === value?.toLowerCase(),
        );
        return country?.code;
      },
      [countries],
    );

    const handleSelectChange = useCallback(
      (value: string | undefined) => {
        const country = countries.find((c) => c.code === value);

        if (!!country) {
          setValue('country', country.name);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [countries],
    );

    const submitForm = useCallback(
      async (data: FormData) => {
        await onSubmit(data);
      },
      [onSubmit],
    );

    return (
      <BaseSurface className={cx('pt-4', className)} {...moreProps}>
        <BaseTypography
          className='text-lg font-medium text-center'
          variant='h4'
        >
          {!!address ? 'Update Address' : 'New Address'}
        </BaseTypography>
        <form className='px-8 pt-4 pb-6' onSubmit={handleSubmit(submitForm)}>
          <div className='pb-4'>
            <BaseInput
              {...register('fullName')}
              type='text'
              label='Name'
              errorMessage={errors['fullName']?.message}
              disabled={isComplete}
              fullWidth
            />
            <BaseInput
              {...register('phoneNumber')}
              type='text'
              label='Phone'
              errorMessage={errors['phoneNumber']?.message}
              disabled={isComplete}
              fullWidth
            />
            <BaseInput
              {...register('addressLine')}
              type='text'
              label='Address Line 1'
              errorMessage={errors['addressLine']?.message}
              disabled={isComplete}
              fullWidth
            />
            <BaseInput
              {...register('city')}
              type='text'
              label='City'
              errorMessage={errors['city']?.message}
              disabled={isComplete}
              fullWidth
            />
            <Controller
              name='country'
              control={control}
              render={({ field: { onChange, value, ...moreFields } }) => (
                <BaseSelect
                  value={selectCountryValue(value || undefined)}
                  label='Country'
                  errorMessage={errors['country']?.message}
                  disabled={isComplete}
                  onChange={handleSelectChange}
                  fullWidth
                  {...moreFields}
                >
                  {countries.map((country) => (
                    <BaseOption key={country.code} value={country.code}>
                      {country.name}
                    </BaseOption>
                  ))}
                </BaseSelect>
              )}
            />
            <BaseInput
              {...register('zipCode', { valueAsNumber: true })}
              type='number'
              label='Zip Code'
              errorMessage={errors['zipCode']?.message}
              disabled={isComplete}
              fullWidth
            />
          </div>
          <div className='flex items-start'>
            {!!address && !!onRemove && (
              <Menu placement='top-start'>
                <MenuHandler>
                  <BaseIconButton
                    name='trash'
                    className='mr-2 shrink-0 !w-[40px]'
                    variant='outlined'
                    loading={isSubmitting}
                    disabled={isComplete || disabled || address.isDefault}
                    iconProps={removeIconButtonProps}
                  />
                </MenuHandler>
                <BaseMenuList className='!z-[9999]'>
                  <BaseMenuItem
                    className='flex justify-start items-center'
                    disabled={isSubmitting || isComplete || address.isDefault}
                    onClick={onRemove}
                  >
                    Delete Address
                  </BaseMenuItem>
                </BaseMenuList>
              </Menu>
            )}
            <BaseButton
              type='submit'
              className='min-h-[40px]'
              loading={isSubmitting}
              disabled={(isComplete || disabled) && !isSubmitting}
              fullWidth
            >
              {submitBtnLabel}
            </BaseButton>
          </div>
        </form>
      </BaseSurface>
    );
  },
);

export default UserAccountAddressUpsertForm;
