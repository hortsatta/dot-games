'use client';

import { forwardRef, memo } from 'react';
import { cx } from 'classix';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'hr'> & {
  isHorizontal?: boolean;
};

const BaseDivider = memo(
  forwardRef<HTMLHRElement, Props>(function BaseDivider(
    { className, isHorizontal, ...moreProps }: Props,
    ref,
  ) {
    return (
      <hr
        ref={ref}
        className={cx(
          'dark:border-current-dark/25',
          isHorizontal ? 'mx-4 w-[1px] h-full border-0 border-l' : 'my-4',
          className,
        )}
        {...moreProps}
      />
    );
  }),
);

export default BaseDivider;
