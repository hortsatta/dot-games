'use client';

import { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonGroup } from '@material-tailwind/react';
import { cx } from 'classix';
import { motion } from 'framer-motion';

import BaseIcon from '../base/base-icon.component';
import BaseButton from '../base/base-button.component';
import BaseTypography from '../base/base-typography.component';

import type { HTMLMotionProps } from 'framer-motion';

const containerAnimateVariant = {
  hidden: { x: -100, opacity: 0.5 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.5,
      staggerChildren: 0.5,
    },
  },
};

const itemAnimateVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const AuthSignUpComplete = memo(function AuthSignUpComplete({
  className,
  ...moreProps
}: HTMLMotionProps<'div'>) {
  const router = useRouter();

  const handleHomeNavigate = useCallback(() => {
    router.push('/');
    router.refresh();
  }, [router]);

  const handleAccountNavigate = useCallback(() => {
    router.push('/account');
    router.refresh();
  }, [router]);

  return (
    <motion.div
      className={cx('flex flex-col items-center justify-start', className)}
      variants={containerAnimateVariant}
      initial='hidden'
      animate='show'
      {...moreProps}
    >
      <motion.div
        className='mb-4 flex items-center justify-center'
        variants={itemAnimateVariant}
      >
        <BaseIcon
          name='check-circle'
          className='mr-2 fill-green-500'
          width={40}
          height={40}
        />
        <div className='mb-1'>
          <BaseTypography
            className='!text-green-500 text-sm'
            variant='paragraph'
          >
            Congratulations!
          </BaseTypography>
          <BaseTypography
            className='text-lg uppercase !text-green-500 leading-none font-medium'
            variant='paragraph'
          >
            Sign Up Complete
          </BaseTypography>
        </div>
      </motion.div>
      <motion.div className='w-full' variants={itemAnimateVariant}>
        <ButtonGroup variant='outlined' size='lg' fullWidth>
          <BaseButton onClick={handleHomeNavigate}>Back to Home</BaseButton>
          <BaseButton onClick={handleAccountNavigate}>Go to Account</BaseButton>
        </ButtonGroup>
      </motion.div>
    </motion.div>
  );
});

export default AuthSignUpComplete;
