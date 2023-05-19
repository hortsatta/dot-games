'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Dialog } from '@material-tailwind/react';
import { AnimatePresence, motion } from 'framer-motion';
import { cx } from 'classix';

import { useBoundStore } from '#/hooks/use-store.hook';
import BaseButton from '../base/base-button.component';
import BaseIcon from '../base/base-icon.component';
import AuthSignInForm from './auth-sign-in-form.component';
import AuthSignUpForm from './auth-sign-up-form.component';

import logoPng from '#/assets/images/logo.png';

import type { DialogProps } from '@material-tailwind/react';

type Props = Omit<DialogProps, 'open' | 'handler' | 'children'> & {
  open?: DialogProps['open'];
  handler?: DialogProps['handler'];
  children?: DialogProps['children'];
};

const formAnimate = {
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -300 },
  transition: {
    type: 'tween',
    duration: 0.3,
  },
};

const AuthSignDialog = memo(function AuthSignDialog({ className }: Props) {
  const router = useRouter();
  const showLogin = useBoundStore((state) => state.showLogin);
  const setShowLogin = useBoundStore((state) => state.setShowLogin);
  const [isSignIn, setIsSignIn] = useState(true);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(!open);
    if (open) {
      setIsSignIn(true);
    }
  }, [open]);

  const handleToggleSignIn = useCallback(() => setIsSignIn(true), []);

  const handleToggleSignUp = useCallback(() => setIsSignIn(false), []);

  const handleSignInSubmit = useCallback(() => {
    router.push('/');
    router.refresh();
  }, [router]);

  const handleSignUpSubmit = useCallback(
    (path: string) => {
      router.push(path);
      router.refresh();
    },
    [router],
  );

  useEffect(() => {
    if (!showLogin) {
      return;
    }

    handleOpen();
    setShowLogin(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLogin, handleOpen]);

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
        <div className='pt-[1px] flex flex-col items-start justify-start leading-none text-left'>
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
        <div className='flex items-center'>
          <AnimatePresence initial={false}>
            {isSignIn ? (
              <motion.div
                key='signin'
                className='shrink-0 flex flex-col justify-start items-center w-full'
                layout
                {...formAnimate}
              >
                <Image
                  src={logoPng}
                  alt='logo'
                  className='mb-4 mr-4 self-end'
                  width={176}
                  height={29}
                  quality={100}
                />
                <AuthSignInForm
                  className='w-full'
                  onToggleSignUp={handleToggleSignUp}
                  onComplete={handleSignInSubmit}
                />
              </motion.div>
            ) : (
              <motion.div
                key='signup'
                className='shrink-0 flex flex-col justify-start items-center w-full'
                layout
                {...formAnimate}
              >
                <Image
                  src={logoPng}
                  alt='logo'
                  className='mb-4 ml-4 self-start'
                  width={176}
                  height={29}
                  quality={100}
                />
                <AuthSignUpForm
                  className='w-full'
                  onToggleSignIn={handleToggleSignIn}
                  onComplete={handleSignUpSubmit}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Dialog>
    </>
  );
});

export default AuthSignDialog;
