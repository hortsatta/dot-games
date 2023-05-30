'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Menu, MenuHandler } from '@material-tailwind/react';
import { cx } from 'classix';
import { toast } from 'react-hot-toast';

import { useAuth } from '#/hooks/use-auth.hook';
import { useTimeout } from '#/hooks/use-timeout.hook';
import BaseTypography from '../base/base-typography.component';
import BaseButton from '../base/base-button.component';
import BaseMenuList from '../base/base-menu-list.component';
import BaseMenuItem from '../base/base-menu-item.component';
import BaseDivider from '../base/base-divider.component';

import type { ComponentProps } from 'react';
import type { UserAccount } from '#/types/user-account.type';

type Props = ComponentProps<'div'> & {
  userAccount: UserAccount;
};

const UserAccountNameTag = memo(function UserAccountNameTag({
  className,
  userAccount: { fullName, displayName, email, avatarType, avatarImageUrl },
  ...moreProps
}: Props) {
  const router = useRouter();
  const { signOut } = useAuth();
  const { timeoutFn: delayedSignOut } = useTimeout(signOut, 1500);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const name = useMemo(() => {
    if (!!displayName?.trim()) {
      return displayName;
    }

    return fullName?.trim().split(' ')[0] || email;
  }, [fullName, displayName, email]);

  const avatarSrc = useMemo(() => {
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/main/images/avatars`;
    return avatarType !== 0
      ? `${baseUrl}/avatar-${avatarType}.png`
      : `${baseUrl}/custom/${avatarImageUrl}`;
  }, [avatarType, avatarImageUrl]);

  const handleSignOut = useCallback(async () => {
    const errorMessge = 'Sign in failed. Please try again later';

    try {
      // Sign out current user, show toast notification if error.
      // else proceed to home and refresh
      setIsSigningOut(true);
      const result = await delayedSignOut();

      if (!result) {
        setIsSigningOut(false);
        toast.error(errorMessge);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setIsSigningOut(false);
      toast.error(errorMessge);
    }
  }, [delayedSignOut, router]);

  return (
    <div className={cx('pl-4', className)} {...moreProps}>
      <Menu placement='bottom-start'>
        <MenuHandler>
          <BaseButton
            className={cx(
              'flex justify-start items-center pl-3 pr-4 py-2 normal-case text-lg focus:!outline-0 min-w-[80px] min-h-[50px]',
              isSigningOut && 'ml-3 !transition-none',
            )}
            variant='text'
            loading={isSigningOut}
          >
            <Avatar
              src={avatarSrc}
              alt='avatar'
              className='mr-2.5 bg-surface/50 border border-red-900'
              variant='rounded'
              size='sm'
            />
            <div className='pt-[1px] flex flex-col items-start justify-start leading-none text-left'>
              <BaseTypography
                className='mb-0.5 leading-none font-medium'
                variant='paragraph'
              >
                {name}
              </BaseTypography>
              <small className='text-green-500 text-sm leading-none'>
                novice
              </small>
            </div>
          </BaseButton>
        </MenuHandler>
        <BaseMenuList className='!z-[9999]'>
          <BaseMenuItem
            className='flex justify-start items-center'
            iconName='skull'
            disabled={isSigningOut}
            onClick={() => router.push('/account')}
          >
            View Account
          </BaseMenuItem>
          <BaseDivider className='my-2' />
          <BaseMenuItem
            className='flex justify-start items-center'
            iconName='door-open'
            loading={isSigningOut}
            onClick={handleSignOut}
          >
            Sign Out
          </BaseMenuItem>
        </BaseMenuList>
      </Menu>
    </div>
  );
});

export default UserAccountNameTag;
