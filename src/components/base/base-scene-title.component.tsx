import { memo } from 'react';
import { cx } from 'classix';
import BaseTypography from './base-typography.component';
import type { ComponentProps } from 'react';

const BaseSceneTitle = memo(function BaseSceneTitle({
  className,
  variant,
  ...moreProps
}: ComponentProps<typeof BaseTypography>) {
  return (
    <BaseTypography
      className={cx(
        'pb-1.5 mb-6 text-base font-medium border-b !border-b-current-dark/25',
        className,
      )}
      variant={variant || 'h1'}
      {...moreProps}
    />
  );
});

export default BaseSceneTitle;
