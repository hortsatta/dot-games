'use client';

import { forwardRef, memo } from 'react';
import { MenuItem } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseIcon from './base-icon.component';
import BaseSpinner from './base-spinner.component';

import type { ComponentProps } from 'react';
import type { IconName } from './base-icon.component';

type Props = ComponentProps<typeof MenuItem> & {
  iconName?: IconName;
  loading?: boolean;
};

const BaseMenuItem = memo(
  forwardRef<HTMLButtonElement, Props>(function BaseMenuItem(
    { className, iconName, loading, children, ...moreProps }: Props,
    ref,
  ) {
    return (
      <MenuItem
        ref={ref}
        className={cx(
          'relative text-current-dark hover:!bg-primary/80 hover:!text-current-dark leading-none min-h-[36px]',
          !!iconName && 'flex justify-start items-center',
          loading && '!cursor-not-allowed !pointer-events-none',
          className,
        )}
        {...moreProps}
      >
        {loading ? (
          <BaseSpinner className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5' />
        ) : (
          <>
            {iconName && (
              <BaseIcon
                name={iconName}
                className='mr-2'
                width={20}
                height={20}
              />
            )}
            {children}
          </>
        )}
      </MenuItem>
    );
  }),
);

export default BaseMenuItem;
