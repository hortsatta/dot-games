'use client';

import { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseButton from '../base/base-button.component';
import BaseIcon from '../base/base-icon.component';
import AuthSignInForm from './auth-sign-in-form.component';

import logoSrc from '#/assets/images/logo.png';

import type { DialogProps } from '@material-tailwind/react';
import BaseTypography from '../base/base-typography.component';

type Props = Omit<DialogProps, 'open' | 'handler' | 'children'> & {
  open?: DialogProps['open'];
  handler?: DialogProps['handler'];
  children?: DialogProps['children'];
};

const AuthSignDialog = memo(function AuthSignDialog({ className }: Props) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setOpen(!open);
    if (open) {
      setIsSignIn(true);
    }
  }, [open]);

  return (
    <>
      <BaseButton
        className='ml-5 px-2 h-full flex items-center dark:text-current-dark/100 text-lg'
        variant='icon'
        onClick={handleOpen}
      >
        <BaseIcon
          name='user-focus'
          className='mr-2 dark:fill-current-dark/100'
          width={36}
          height={36}
        />
        <div className='flex flex-col items-start justify-start leading-none text-left'>
          <span>Sign In</span>
          <small className='dark:text-current-dark/60 font-normal text-xs normal-case leading-none'>
            or register to gain full access
          </small>
        </div>
      </BaseButton>
      <Dialog
        className={cx('bg-transparent overflow-hidden', className)}
        size='xs'
        open={open}
        handler={handleOpen}
      >
        {isSignIn ? (
          <div className='flex flex-col justify-start items-center'>
            <Image
              src={logoSrc}
              alt='logo'
              className='mb-4 mr-4 self-end'
              width={176}
              height={29}
              quality={100}
            />
            <AuthSignInForm
              className='w-full'
              onToggleSignUp={() => setIsSignIn(false)}
            />
          </div>
        ) : (
          <div></div>
        )}
      </Dialog>
    </>
  );
});

export default AuthSignDialog;
