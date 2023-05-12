'use client';

import { memo } from 'react';
import { Typography } from '@material-tailwind/react';
import { cx } from 'classix';

import type { ComponentProps, ReactNode } from 'react';

type Props = Omit<ComponentProps<typeof Typography>, 'children'> & {
  children?: ReactNode;
};

const BaseTypography = memo(function BaseTypography({
  className,
  color,
  ...moreProps
}: Props) {
  return (
    <Typography
      className={cx(!color && 'dark:text-current-dark', className)}
      color={color}
      {...moreProps}
    />
  );
});

export default BaseTypography;
