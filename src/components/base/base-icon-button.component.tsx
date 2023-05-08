'use client';

import { memo } from 'react';
import { IconButton } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseIcon from './base-icon.component';
import BaseSpinner from './base-spinner.component';

import type { ComponentProps } from 'react';
import type { IconName } from './base-icon.component';

type Props = Omit<ComponentProps<typeof IconButton>, 'children'> & {
  name: IconName;
  loading?: boolean;
};

const BaseIconButton = memo(function BaseIconButton({
  name,
  className,
  variant = 'filled',
  color = 'red',
  loading,
  ...moreProps
}: Props) {
  return (
    <IconButton
      className={cx(
        'relative ',
        color === 'red' && '!shadow-red-500/40 hover:!shadow-red-500/60',
        color === 'red' && variant === 'filled' && 'bg-primary',
        variant !== 'text' && variant !== 'outlined' && '!shadow-lg',
        loading && '!cursor-not-allowed !pointer-events-none',
        className,
      )}
      variant={variant}
      color={color}
      {...moreProps}
    >
      {loading ? (
        <BaseSpinner className='w-6 h-6' />
      ) : (
        <BaseIcon
          name={name}
          className='fill-current-dark'
          width={24}
          height={24}
        />
      )}
    </IconButton>
  );
});

export default BaseIconButton;
