import { memo } from 'react';
import { cx } from 'classix';
import BaseTypography from './base-typography.component';
import type { ComponentProps } from 'react';

const BaseFieldTitle = memo(function BaseFieldTitle({
  className,
  ...moreProps
}: ComponentProps<typeof BaseTypography>) {
  return (
    <BaseTypography
      className={cx(
        '!text-red-300/70 text-xs font-medium uppercase leading-none',
        className,
      )}
      {...moreProps}
    />
  );
});

export default BaseFieldTitle;
