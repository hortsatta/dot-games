'use client';

import { forwardRef, memo, useMemo } from 'react';
import { Input } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseTypography from './base-typography.component';
import BaseIcon from './base-icon.component';

import type { ComponentProps, ReactNode } from 'react';
import type { IconName } from './base-icon.component';

type Props = ComponentProps<typeof Input> & {
  description?: string | ReactNode;
  errorMessage?: string;
  fullWidth?: boolean;
  iconName?: IconName;
  wrapperProps?: ComponentProps<'div'>;
  labelProps?: ComponentProps<typeof BaseTypography>;
  descriptionProps?: ComponentProps<typeof BaseTypography>;
  errorMessageProps?: ComponentProps<typeof BaseTypography>;
};

const BaseInput = memo(
  forwardRef<HTMLInputElement, Props>(function BaseInput(
    {
      className,
      placeholder,
      description,
      errorMessage,
      fullWidth,
      iconName,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      descriptionProps: {
        className: descriptionClassName,
        ...moreDescriptionProps
      } = {},
      errorMessageProps: {
        className: errorMessageClassName,
        ...moreErrorMessageProps
      } = {},
      ...moreProps
    },
    ref,
  ) {
    const labelProps = useMemo(
      () => ({
        className: cx(
          'dark:!text-current-dark/60 dark:peer-focus:!text-blue-500 dark:peer-focus:font-semibold',
          !!errorMessage && 'dark:!text-red-500 dark:peer-focus:!text-red-500',
          !!iconName && 'hidden',
        ),
      }),
      [errorMessage, iconName],
    );

    return (
      <div
        className={cx('mb-4', fullWidth ? 'w-full' : 'w-60', wrapperClassName)}
        {...moreWrapperProps}
      >
        <div className='relative'>
          {!!iconName && (
            <div className='absolute pr-1.5 left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center border-r border-current/20 dark:border-current-dark/20'>
              <BaseIcon
                name={iconName}
                className='dark:fill-current-dark/60'
                width={20}
                height={20}
              />
            </div>
          )}
          <Input
            ref={ref}
            className={cx(
              'dark:text-current-dark dark:placeholder:!text-current-dark/50 dark:placeholder:focus:!text-blue-500',
              (!!iconName || !!placeholder) &&
                'pl-11 !border-t-blue-gray-200 focus:!border-t-blue-500',
              (!!iconName || !!placeholder) &&
                !!errorMessage &&
                '!border-t-red-500 focus:!border-t-red-500 dark:placeholder:!text-red-500 dark:placeholder:focus:!text-red-500',
              fullWidth && 'w-full',
              className,
            )}
            placeholder={placeholder}
            labelProps={labelProps}
            error={!!errorMessage}
            size='lg'
            {...moreProps}
          />
        </div>
        {!errorMessage && !!description && (
          <BaseTypography
            variant='small'
            className={cx(
              'mt-2 flex items-center gap-1 font-normal dark:text-current-dark/60',
              descriptionClassName,
            )}
            {...moreDescriptionProps}
          >
            {description}
          </BaseTypography>
        )}
        {!!errorMessage && (
          <BaseTypography
            variant='small'
            color='red'
            className={cx(
              'flex items-center gap-1 text-xs font-normal mt-1.5',
              errorMessageClassName,
            )}
            {...moreErrorMessageProps}
          >
            {errorMessage}
          </BaseTypography>
        )}
      </div>
    );
  }),
);

export default BaseInput;
