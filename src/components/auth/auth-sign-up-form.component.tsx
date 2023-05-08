'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { cx } from 'classix';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuth } from '#/hooks/useAuth.hook';
import { useTimeout } from '#/hooks/useTimeout.hook';
import BaseSurface from '../base/base-surface.component';
import BaseInput from '../base/base-input.component';
import BaseButton from '../base/base-button.component';
import BaseIconButton from '../base/base-icon-button.component';
import BaseDivider from '../base/base-divider.component';
import BaseTypography from '../base/base-typography.component';
import AuthSignUpComplete from './auth-sign-up-complete.component';

import type { ComponentProps } from 'react';
import type { AuthCredentials } from '#/types/auth.type';

export type FormData = AuthCredentials & {
  confirmPassword: string;
  fullName: string;
  displayName: string;
};

type Props = ComponentProps<'div'> & {
  onComplete?: (path: string) => void;
  onToggleSignIn?: () => void;
};

const authCompleteAnimate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const schema = z
  .object({
    email: z.string().email('Provide your email address'),
    password: z.string().min(6, 'Password should be minimum of 6 characters'),
    confirmPassword: z.string(),
    fullName: z.string().min(4, 'Name should be more than of 3 characters'),
    displayName: z
      .string()
      .min(4, 'Display name should be more than of 3 characters')
      .max(64, 'Display name is too long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

const defaultValues: FormData = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  displayName: '',
};

const AuthSignUpForm = memo(function AuthSignUpForm({
  className,
  onToggleSignIn = () => null,
  onComplete,
  ...moreProps
}: Props) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { signUp } = useAuth();
  const { timeoutFn: delayedSignUp } = useTimeout(signUp, 1500);
  const [isPasswordReveal, setIsPasswordReveal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [completePath, setCompletePath] = useState<string | null>(null);

  useEffect(() => {
    if (!isComplete || !completePath) {
      return;
    }

    onComplete && onComplete(completePath);
  }, [isComplete, completePath, onComplete]);

  const toggleIsPasswordReveal = useCallback(() => {
    setIsPasswordReveal(!isPasswordReveal);
  }, [isPasswordReveal]);

  const submitForm = useCallback(
    async (data: FormData) => {
      try {
        // Sign up and invoke callbox onSubmit if sign-in success
        const result = await delayedSignUp(data);
        if (result) {
          setIsComplete(true);
        } else {
          toast.error(
            'Sign up failed. Ensure that fields are populated properly',
          );
        }
      } catch (error) {
        toast.error('Sign un failed. Please try again later');
      }
    },
    [delayedSignUp],
  );

  return (
    <BaseSurface className={cx('pt-4', className)} {...moreProps}>
      <form className='px-8 pt-4 pb-6' onSubmit={handleSubmit(submitForm)}>
        <div className='pb-4'>
          <BaseInput
            {...register('email')}
            type='email'
            placeholder='Email'
            iconName='at'
            errorMessage={errors['email']?.message}
            fullWidth
            autoFocus
            disabled={isComplete}
          />
          <div className='relative'>
            <BaseInput
              {...register('password')}
              type={isPasswordReveal ? 'text' : 'password'}
              className='pr-12'
              placeholder='Password'
              iconName='keyhole'
              errorMessage={errors['password']?.message}
              fullWidth
              disabled={isComplete}
            />
            <div className='absolute right-0 top-0 h-11'>
              <BaseIconButton
                className='p-2 h-full max-h-none'
                name={isPasswordReveal ? 'hand-eye' : 'hand-fist'}
                variant='text'
                onClick={toggleIsPasswordReveal}
              />
            </div>
          </div>
          <BaseInput
            {...register('confirmPassword')}
            type={isPasswordReveal ? 'text' : 'password'}
            className='pr-12'
            placeholder='Confirm Password'
            iconName='keyhole'
            errorMessage={errors['confirmPassword']?.message}
            fullWidth
            disabled={isComplete}
          />
          <BaseDivider />
          <BaseInput
            {...register('fullName')}
            type='text'
            label='Name'
            errorMessage={errors['fullName']?.message}
            fullWidth
            disabled={isComplete}
          />
          <BaseInput
            {...register('displayName')}
            type='text'
            label='Display Name'
            errorMessage={errors['displayName']?.message}
            fullWidth
            disabled={isComplete}
          />
        </div>
        <BaseTypography
          className='mb-6 px-4 dark:text-current-dark/60 text-xs leading-relaxed'
          variant='small'
        >
          By signing up, you agree to the Terms of Service and Privacy Policy,
          including Cookie Use.
        </BaseTypography>
        {!isComplete && (
          <BaseButton type='submit' size='lg' fullWidth loading={isSubmitting}>
            Sign Up
          </BaseButton>
        )}
        <AnimatePresence>
          {isComplete && (
            <motion.div {...authCompleteAnimate}>
              <AuthSignUpComplete
                onNavigate={(path: string) => setCompletePath(path)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      {!isComplete && (
        <div className='pb-4 flex justify-center'>
          <BaseButton
            className='normal-case text-sm dark:text-current-dark'
            variant='text'
            onClick={onToggleSignIn}
          >
            <span className='font-normal'>
              I already have an account.{' '}
              <span className='text-primary font-medium'>Sign in</span>
            </span>
          </BaseButton>
        </div>
      )}
    </BaseSurface>
  );
});

export default AuthSignUpForm;
