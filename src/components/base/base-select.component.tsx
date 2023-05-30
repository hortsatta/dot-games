import { forwardRef, memo, useMemo } from 'react';
import { Select } from '@material-tailwind/react';
import { cx } from 'classix';

import BaseTypography from './base-typography.component';

import type { ComponentProps, ReactNode } from 'react';

type Props = ComponentProps<typeof Select> & {
  description?: string | ReactNode;
  errorMessage?: string;
  fullWidth?: boolean;
  wrapperProps?: ComponentProps<'div'>;
  labelProps?: ComponentProps<typeof BaseTypography>;
  descriptionProps?: ComponentProps<typeof BaseTypography>;
  errorMessageProps?: ComponentProps<typeof BaseTypography>;
};

const BaseSelect = memo(
  forwardRef<HTMLDivElement, Props>(function BaseSelect(
    {
      className,
      description,
      errorMessage,
      fullWidth,
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
        ),
      }),
      [errorMessage],
    );

    return (
      <div
        className={cx('mb-4', fullWidth ? 'w-full' : 'w-60', wrapperClassName)}
        {...moreWrapperProps}
      >
        <Select
          ref={ref}
          className={cx(
            'dark:text-current-dark dark:placeholder:!text-current-dark/50 dark:placeholder:focus:!text-blue-500 dark:disabled:bg-current-dark/10',
            fullWidth && 'w-full',
            className,
          )}
          labelProps={labelProps}
          error={!!errorMessage}
          size='lg'
          menuProps={{
            className: 'bg-[#301] border border-border text-current-dark/80',
          }}
          {...moreProps}
        />
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

export default BaseSelect;
