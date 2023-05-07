'use client';

import { memo, useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { cx } from 'classix';
import { toast } from 'react-hot-toast';

import { useAuth } from '#/hooks/useAuth.hook';
import { useTimeout } from '#/hooks/useTimeout.hook';
import BaseSurface from '../base/base-surface.component';
import BaseInput from '../base/base-input.component';
import BaseButton from '../base/base-button.component';
import BaseIconButton from '../base/base-icon-button.component';

import type { ComponentProps } from 'react';
import type { AuthCredentials } from '#/types/auth.type';

type Props = ComponentProps<'div'> & {
  onSubmit?: () => void;
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
  onSubmit,
  onToggleSignUp = () => null,
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

  const { signIn } = useAuth();
  const { timeoutFn: delayedSignIn } = useTimeout(signIn, 1500);
  const [isPasswordReveal, setIsPasswordReveal] = useState(false);

  const toggleIsPasswordReveal = useCallback(() => {
    setIsPasswordReveal(!isPasswordReveal);
  }, [isPasswordReveal]);

  const submitForm = useCallback(
    async (data: AuthCredentials) => {
      try {
        const result = await delayedSignIn(data);

        if (result) {
          onSubmit && onSubmit();
        } else {
          toast.error('Sign in failed. Email or password is incorrect.');
        }
      } catch (error) {
        toast.error('Sign in failed. Please try again later');
      }
    },
    [onSubmit, delayedSignIn],
  );

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
      <div className='pb-4 flex justify-center'>
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
      </div>
    </BaseSurface>
  );
});

export default AuthSignInForm;
