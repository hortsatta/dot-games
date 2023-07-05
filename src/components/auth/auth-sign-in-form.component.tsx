'use client';

import { memo, useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { cx } from 'classix';
import { toast } from 'react-hot-toast';

import { useAuth } from '#/hooks/use-auth.hook';
import { useTimeout } from '#/hooks/use-timeout.hook';
import BaseSurface from '../base/base-surface.component';
import BaseInput from '../base/base-input.component';
import BaseButton from '../base/base-button.component';
import BaseIconButton from '../base/base-icon-button.component';

import type { ComponentProps } from 'react';
import type { AuthCredentials } from '#/types/auth.type';

type Props = ComponentProps<'div'> & {
  onComplete?: () => void;
  onToggleSignUp?: () => void;
};

const schema = z.object({
  email: z.string().email('Provide your email address'),
  password: z.string().min(1, 'Provide your password'),
});

const defaultValues: AuthCredentials = {
  email: '',
  password: '',
};

const AuthSignInForm = memo(function AuthSignInForm({
  className,
  onComplete,
  onToggleSignUp = () => null,
  ...moreProps
}: Props) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
  } = useForm({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { signIn } = useAuth();
  const { timeoutFn: delayedSignIn } = useTimeout(signIn, 1500);
  const [isPasswordReveal, setIsPasswordReveal] = useState(false);

  const toggleIsPasswordReveal = useCallback(() => {
    setIsPasswordReveal(!isPasswordReveal);
  }, [isPasswordReveal]);

  const submitForm = useCallback(
    async (data: AuthCredentials) => {
      try {
        // Sign in and invoke callbox onSubmit if sign-in success
        const result = await delayedSignIn(data);
        if (result) {
          onComplete && onComplete();
        } else {
          toast.error('Sign in failed. Email or password is incorrect');
        }
      } catch (error) {
        toast.error('Sign in failed. Please try again later');
      }
    },
    [onComplete, delayedSignIn],
  );

  // Populate fields with a sample user
  const populateFieldsWithSampleUser = useCallback(() => {
    setValue('email', process.env.NEXT_PUBLIC_SAMPLE_USER_EMAIL || '');
    setValue('password', process.env.NEXT_PUBLIC_SAMPLE_USER_PASSWORD || '');
  }, [setValue]);

  return (
    <BaseSurface className={cx('pt-4', className)} {...moreProps}>
      <form className='px-8 pt-4 pb-6' onSubmit={handleSubmit(submitForm)}>
        <div className='pb-8'>
          <BaseInput
            {...register('email')}
            type='email'
            placeholder='Email'
            iconName='at'
            errorMessage={errors['email']?.message}
            fullWidth
            autoFocus
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
            />
            <div className='absolute right-0 top-0 h-11'>
              <BaseIconButton
                aria-label={
                  isPasswordReveal ? 'hide password' : 'show password'
                }
                className='p-2 h-full max-h-none'
                name={isPasswordReveal ? 'hand-eye' : 'hand-fist'}
                variant='text'
                onClick={toggleIsPasswordReveal}
              />
            </div>
          </div>
        </div>
        <BaseButton type='submit' size='lg' fullWidth loading={isSubmitting}>
          Sign In
        </BaseButton>
      </form>
      <div className='px-4 pb-4 flex flex-col justify-center'>
        <BaseButton
          className='normal-case text-sm dark:text-current-dark'
          variant='text'
          onClick={onToggleSignUp}
        >
          <span className='font-normal'>
            I don&apos;t have an account.{' '}
            <span className='text-primary font-medium'>Sign up</span>
          </span>
        </BaseButton>
        <BaseButton
          className='normal-case text-sm text-secondary font-normal'
          variant='text'
          onClick={populateFieldsWithSampleUser}
        >
          Sign in as a sample user
        </BaseButton>
      </div>
    </BaseSurface>
  );
});

export default AuthSignInForm;
