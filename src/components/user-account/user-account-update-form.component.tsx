'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { Card, CardBody, Tooltip } from '@material-tailwind/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import toast from 'react-hot-toast';
import { cx } from 'classix';

import { updateUserAccount } from '#/api/user-account.api';
import { useBoundStore } from '#/hooks/use-store.hook';
import { useDebounce } from '#/hooks/use-debounce.hook';
import { useSupabase } from '../core/core-supabase-provider';
import BaseButton from '../base/base-button.component';
import BaseDialog from '../base/base-dialog.component';
import BaseDivider from '../base/base-divider.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseInput from '../base/base-input.component';
import BaseTypography from '../base/base-typography.component';
import BaseSurface from '../base/base-surface.component';

import type { ComponentProps, ReactNode } from 'react';
import type { UserAccount } from '#/types/user-account.type';

const WRAPPER_CLASSNAME = 'mb-4';
const VALUE_CLASSNAME = 'leading-none';
const DIVIDER_CLASSNAME = '!my-1 opacity-50';
const labelProps = { className: 'opacity-50', variant: 'small' };
const editIconProps = { className: 'fill-primary' };

export type FormData = {
  fullName: string;
  displayName: string;
};

type Props = Omit<ComponentProps<typeof Card>, 'children'> & {
  userAccount: UserAccount;
  children?: ReactNode;
};

const schema = z.object({
  fullName: z.string().min(4, 'Name should be more than of 3 characters'),
  displayName: z
    .string()
    .min(4, 'Display name should be more than of 3 characters')
    .max(64, 'Display name is too long'),
});

const UserAccountUpdateForm = memo(function UserAccountUpdateForm({
  className,
  userAccount,
}: Props) {
  const { supabase } = useSupabase();
  const { debounce } = useDebounce();
  const setRefreshCurrentUser = useBoundStore(
    (state) => state.setRefreshCurrentUser,
  );

  const defaultValues = useMemo(
    () => ({
      fullName: userAccount.fullName || '',
      displayName: userAccount.displayName || '',
    }),
    [userAccount],
  );

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [open, setOpen] = useState(false);
  const displayName = useMemo(() => userAccount.displayName, [userAccount]);
  const fullName = useMemo(() => userAccount.fullName, [userAccount]);
  const email = useMemo(() => userAccount.email, [userAccount]);

  const handleOpen = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    if (open) {
      reset(defaultValues);
    }
    setOpen(!open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isSubmitting]);

  const submitForm = useCallback(
    async (data: FormData) => {
      const errorMessage = 'Cannot update account. Please try again later';

      try {
        const ua = { ...data, userId: userAccount.userId };
        const result = await updateUserAccount(supabase, ua as UserAccount);
        await debounce(1500);

        if (result) {
          setOpen(false);
          setRefreshCurrentUser(true);
        } else {
          toast.error(errorMessage);
        }
      } catch (error) {
        toast.error(errorMessage);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userAccount],
  );

  return (
    <>
      <Card
        className={cx('relative w-[300px] h-[260px] bg-surface', className)}
      >
        <CardBody className='pt-8 pb-4'>
          <div className='absolute top-2 right-2'>
            <Tooltip content='edit'>
              <BaseIconButton
                name='pencil-simple'
                aria-label='edit address'
                variant='text'
                iconProps={editIconProps}
                onClick={handleOpen}
              />
            </Tooltip>
          </div>
          <div className={WRAPPER_CLASSNAME}>
            <BaseTypography className={cx(VALUE_CLASSNAME, 'pr-6')}>
              {fullName}
            </BaseTypography>
            <BaseDivider className={DIVIDER_CLASSNAME} />
            <BaseTypography {...labelProps}>Full Name</BaseTypography>
          </div>
          <div className={WRAPPER_CLASSNAME}>
            <BaseTypography className={VALUE_CLASSNAME}>
              {displayName}
            </BaseTypography>
            <BaseDivider className={DIVIDER_CLASSNAME} />
            <BaseTypography {...labelProps}>Display Name</BaseTypography>
          </div>
          <div className={WRAPPER_CLASSNAME}>
            <BaseTypography className={VALUE_CLASSNAME}>{email}</BaseTypography>
            <BaseDivider className={DIVIDER_CLASSNAME} />
            <BaseTypography {...labelProps}>Email Address</BaseTypography>
          </div>
        </CardBody>
      </Card>
      <BaseDialog
        className={cx('bg-transparent overflow-hidden', className)}
        size='xs'
        open={open}
        handler={handleOpen}
      >
        <BaseSurface className='px-8 pt-4'>
          <BaseTypography
            className='text-lg font-medium text-center'
            variant='h4'
          >
            Update Account
          </BaseTypography>
          <form className='pt-4 pb-6' onSubmit={handleSubmit(submitForm)}>
            <div className='pb-4'>
              <BaseInput
                {...register('fullName')}
                type='text'
                label='Name'
                errorMessage={errors['fullName']?.message}
                fullWidth
              />
              <BaseInput
                {...register('displayName')}
                type='text'
                label='Display Name'
                errorMessage={errors['displayName']?.message}
                fullWidth
              />
            </div>
            <div>
              <BaseButton
                type='submit'
                className='h-[40px]'
                loading={isSubmitting}
                fullWidth
              >
                Save Changes
              </BaseButton>
            </div>
          </form>
        </BaseSurface>
      </BaseDialog>
    </>
  );
});

export default UserAccountUpdateForm;
