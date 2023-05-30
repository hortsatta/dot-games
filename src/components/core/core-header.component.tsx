'use client';

import { memo } from 'react';
import { cx } from 'classix';

import { useCurrentUserAccount } from '#/hooks/use-current-user-account.hook';
import AuthSignDialog from '../auth/auth-sign-dialog.component';
import UserAccountNameTag from '../user-account/user-account-name-tag.component';
import CoreLogo from './core-logo.component';

import type { ComponentProps } from 'react';

const CoreHeader = memo(function CoreHeader({
  className,
  children,
  ...moreProps
}: ComponentProps<'header'>) {
  const { currentUserAccount } = useCurrentUserAccount();

  return (
    <>
      <header
        className={cx(
          'fixed left-0 top-0 flex justify-between items-center w-full h-[72px] bg-primary/10 border-b-2 border-border backdrop-blur-lg z-[9999]',
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
                <UserAccountNameTag userAccount={currentUserAccount} />
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
