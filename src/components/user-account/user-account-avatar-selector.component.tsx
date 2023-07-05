'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Avatar, Card, CardBody, Tooltip } from '@material-tailwind/react';
import { toast } from 'react-hot-toast';
import { cx } from 'classix';

import { updateUserAccount } from '#/api/user-account.api';
import { useBoundStore } from '#/hooks/use-store.hook';
import { useDebounce } from '#/hooks/use-debounce.hook';
import { useSupabase } from '../core/core-supabase-provider';
import BaseIconButton from '../base/base-icon-button.component';
import BaseTypography from '../base/base-typography.component';
import BaseSurface from '../base/base-surface.component';
import BaseButton from '../base/base-button.component';
import BaseDialog from '../base/base-dialog.component';

import type { ComponentProps, ReactNode } from 'react';
import type { UserAccount } from '#/types/user-account.type';

type Props = Omit<ComponentProps<typeof Card>, 'children'> & {
  userAccount: UserAccount;
  children?: ReactNode;
};

const AVATARS_BASE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/main/images/avatars`;
const editIconProps = { className: 'fill-primary' };

const UserAccountAvatarSelector = memo(function UserAccountAvatarSelector({
  className,
  userAccount,
}: Props) {
  const { supabase } = useSupabase();
  const { debounce } = useDebounce();
  const setRefreshCurrentUser = useBoundStore(
    (state) => state.setRefreshCurrentUser,
  );

  const avatarSrc = useMemo(() => {
    return userAccount.avatarType !== 0
      ? `${AVATARS_BASE_URL}/avatar-${userAccount.avatarType}.png`
      : `${AVATARS_BASE_URL}/custom/${userAccount.avatarImageUrl}`;
  }, [userAccount]);

  const avatarType = useMemo(() => userAccount.avatarType || 0, [userAccount]);

  const avatarSrcs = useMemo(
    () =>
      Array.from(Array(5)).map(
        (_, index) => `${AVATARS_BASE_URL}/avatar-${index + 1}.png`,
      ),
    [],
  );

  const [open, setOpen] = useState(false);
  const [selectedAvatarType, setSelectedAvatarType] = useState(avatarType);
  const [loading, setLoading] = useState(false);

  const handleOpen = useCallback(() => {
    if (loading) {
      return;
    }

    if (open) {
      setSelectedAvatarType(avatarType);
    }
    setOpen(!open);
  }, [open, avatarType, loading]);

  const handleAvatarChange = useCallback(
    async () => {
      const errorMessage = 'Cannot update avatar. Please try again later';

      try {
        setLoading(true);
        const ua = {
          userId: userAccount.userId,
          avatarType: selectedAvatarType,
        };
        const result = await updateUserAccount(supabase, ua as UserAccount);
        await debounce(1500);
        setLoading(false);

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
    [userAccount, selectedAvatarType],
  );

  return (
    <>
      <Card
        className={cx('relative w-[300px] h-[260px] bg-surface', className)}
      >
        <CardBody className='flex justify-center items-center p-4 w-full h-full'>
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
          <div className='w-full flex flex-col items-center'>
            <Avatar
              src={avatarSrc}
              alt='avatar'
              className='mb-1.5 bg-black/20 border border-red-900'
              variant='rounded'
              size='xxl'
            />
            <BaseTypography className='opacity-50' variant='small'>
              User Avatar
            </BaseTypography>
          </div>
        </CardBody>
      </Card>
      <BaseDialog className='min-w-fit' open={open} handler={handleOpen}>
        <BaseSurface className='px-6 py-6'>
          <BaseTypography
            className='mb-4 text-lg font-medium text-center'
            variant='h4'
          >
            Change Avatar
          </BaseTypography>
          <div className='mb-4'>
            {avatarSrcs.map((src, index) => (
              <BaseButton
                key={index}
                className={cx(
                  'mr-2 mb-2 last:mr-0 p-0',
                  selectedAvatarType !== index + 1 &&
                    '!bg-primary/20 !border-border',
                )}
                variant={selectedAvatarType === index + 1 ? 'filled' : 'text'}
                onClick={() => setSelectedAvatarType(index + 1)}
              >
                <Image src={src} alt='' width={80} height={80} />
              </BaseButton>
            ))}
          </div>
          <div>
            <BaseButton
              className='h-[40px]'
              loading={loading}
              onClick={handleAvatarChange}
              fullWidth
            >
              Save Changes
            </BaseButton>
          </div>
        </BaseSurface>
      </BaseDialog>
    </>
  );
});

export default UserAccountAvatarSelector;
