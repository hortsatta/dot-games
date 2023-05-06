'use client';

import { memo } from 'react';
import { Button, ButtonProps } from '@material-tailwind/react';
import { cx } from 'classix';

import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Button>, 'variant'> & {
  variant?: ButtonProps['variant'] | 'icon';
};

const BaseButton = memo(function BaseButton({
  className,
  variant = 'filled',
  color = 'red',
  ...moreProps
}: Props) {
  return (
    <Button
      className={cx(
        '!shadow-lg !font-medium',
        color === 'red' && '!shadow-red-500/40 hover:!shadow-red-500/60',
        color === 'red' && variant === 'filled' && 'bg-primary',
        variant === 'text' && '!shadow-none',
        variant === 'icon' &&
          'group !shadow-none opacity-80 hover:!bg-transparent hover:opacity-100',
        className,
      )}
      variant={variant === 'icon' ? 'text' : variant}
      color={color}
      {...moreProps}
    />
  );
});

export default BaseButton;
