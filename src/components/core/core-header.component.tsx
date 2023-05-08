'use client';

import { memo } from 'react';
import { cx } from 'classix';

import { useUserAccount } from '#/hooks/useUserAccount.hook';
import AuthSignDialog from '../auth/auth-sign-dialog.component';
import UserAccountProfileAvatar from '../user-account/user-account-profile-avatar.component';
import CoreLogo from './core-logo.component';

import type { ComponentProps } from 'react';

const CoreHeader = memo(function CoreHeader({
  className,
  children,
  ...moreProps
}: ComponentProps<'header'>) {
  const { currentUserAccount } = useUserAccount();

  return (
    <>
      <header
        className={cx(
          'sticky flex justify-between items-center h-[72px] bg-primary/5 border-b-2 border-primary/[.15]',
          className,
        )}
        {...moreProps}
      >
        {currentUserAccount !== undefined && (
          <>
            <div className='max-w-[250px] w-full'>
              {currentUserAccount == null ? (
                <AuthSignDialog />
              ) : (
                <UserAccountProfileAvatar userAccount={currentUserAccount} />
              )}
            </div>
            {children}
            <div className='flex justify-end max-w-[250px] w-full'>
              <CoreLogo href='/' />
            </div>
          </>
        )}
      </header>
    </>
  );
});

export default CoreHeader;
