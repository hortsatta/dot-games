'use client';

import { forwardRef, memo } from 'react';
import { Button, ButtonProps } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseSpinner from './base-spinner.component';

import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Button>, 'variant'> & {
  variant?: ButtonProps['variant'] | 'icon';
  loading?: boolean;
};

const BaseButton = memo(
  forwardRef<HTMLButtonElement, Props>(function BaseButton(
    {
      className,
      variant = 'filled',
      color = 'red',
      size,
      loading,
      children,
      ...moreProps
    }: Props,
    ref,
  ) {
    return (
      <Button
        ref={ref}
        className={cx(
          'relative !font-medium',
          color === 'red' && '!shadow-red-500/40 hover:!shadow-red-500/60',
          color === 'deep-purple' &&
            '!shadow-deep-purple-500/40 hover:!shadow-deep-purple-500/60',
          color === 'red' && variant === 'filled' && 'bg-primary',
          color === 'deep-purple' && variant === 'filled' && 'bg-secondary',
          variant !== 'text' &&
            variant !== 'outlined' &&
            variant !== 'icon' &&
            '!shadow-lg',
          variant === 'icon' &&
            'group opacity-80 hover:!bg-transparent hover:opacity-100',
          size === 'sm' && 'min-w-[32px] min-h-[32px]',
          size === 'md' && 'min-w-[40px] min-h-[40px]',
          size === 'lg' && 'min-w-[48px] min-h-[48px]',
          loading && '!cursor-not-allowed !pointer-events-none',
          className,
        )}
        variant={variant === 'icon' ? 'text' : variant}
        color={color}
        size={size}
        {...moreProps}
      >
        {loading ? (
          <BaseSpinner
            className={cx(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7',
              size === 'lg' && '!w-8 !h-8',
            )}
          />
        ) : (
          children
        )}
      </Button>
    );
  }),
);

export default BaseButton;
