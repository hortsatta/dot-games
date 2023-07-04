'use client';

import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cx } from 'classix';

import { useCurrentUserAccount } from '#/hooks/use-current-user-account.hook';
import AuthSignDialog from '../auth/auth-sign-dialog.component';
import UserAccountNameTag from '../user-account/user-account-name-tag.component';
import CoreLogo from './core-logo.component';

import type { ComponentProps } from 'react';

const animate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

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
          'fixed left-0 top-0 w-full h-[72px] bg-primary/10 border-b-2 border-border backdrop-blur-lg z-[9999]',
          className,
        )}
        {...moreProps}
      >
        <AnimatePresence>
          {currentUserAccount !== undefined && (
            <motion.div
              className='flex justify-between items-center w-full h-full'
              {...animate}
            >
              <div className='relative max-w-[250px] w-full'>
                <div
                  className={cx(
                    'w-full',
                    !!currentUserAccount &&
                      '!w-0 absolute overflow-hidden opacity-0',
                  )}
                >
                  <AuthSignDialog />
                </div>
                {!!currentUserAccount && (
                  <UserAccountNameTag userAccount={currentUserAccount} />
                )}
              </div>
              {children}
              <div className='flex justify-end max-w-[250px] w-full'>
                <CoreLogo href='/' />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
});

export default CoreHeader;
