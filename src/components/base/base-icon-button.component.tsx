'use client';

import { forwardRef, memo } from 'react';
import { IconButton } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseIcon from './base-icon.component';
import BaseSpinner from './base-spinner.component';

import type { ComponentProps } from 'react';
import type { IconName } from './base-icon.component';

type Props = Omit<ComponentProps<typeof IconButton>, 'children'> & {
  name: IconName;
  loading?: boolean;
  iconProps?: Omit<ComponentProps<typeof BaseIcon>, 'name'> & {
    name?: IconName;
  };
};

const BaseIconButton = memo(
  forwardRef<HTMLButtonElement, Props>(function BaseIconButton(
    {
      name,
      className,
      variant = 'filled',
      color = 'red',
      loading,
      iconProps,
      ...moreProps
    }: Props,
    ref,
  ) {
    const { className: iconClassName, ...moreIconProps } = iconProps || {};

    return (
      <IconButton
        ref={ref}
        className={cx(
          'relative ',
          color === 'red' && '!shadow-red-500/40 hover:!shadow-red-500/60',
          color === 'deep-purple' &&
            '!shadow-deep-purple-500/40 hover:!shadow-deep-purple-500/60',
          color === 'red' && variant === 'filled' && 'bg-primary',
          color === 'deep-purple' && variant === 'filled' && 'bg-secondary',
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
            className={cx('fill-current-dark', iconClassName)}
            width={24}
            height={24}
            {...moreIconProps}
          />
        )}
      </IconButton>
    );
  }),
);

export default BaseIconButton;
