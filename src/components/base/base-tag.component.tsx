import { memo } from 'react';
import { cx } from 'classix';
import type { ComponentProps } from 'react';

const BaseTag = memo(function BaseTag({
  className,
  children,
}: ComponentProps<'div'>) {
  return (
    <div
      className={cx(
        'px-2 pb-1 pt-1.5 w-fit bg-green-500 text-sm font-semibold leading-none rounded-full uppercase',
        className,
      )}
    >
      {children}
    </div>
  );
});

export default BaseTag;
