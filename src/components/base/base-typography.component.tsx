'use client';

import { memo } from 'react';
import { Typography } from '@material-tailwind/react';
import { cx } from 'classix';

import type { ComponentProps } from 'react';

const BaseTypography = memo(function BaseTypography({
  className,
  color,
  ...moreProps
}: ComponentProps<typeof Typography>) {
  return (
    <Typography
      className={cx(!color && 'dark:text-current-dark', className)}
      color={color}
      {...moreProps}
    />
  );
});

export default BaseTypography;
