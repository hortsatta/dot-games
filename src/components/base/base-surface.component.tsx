import { cx } from 'classix';
import type { ComponentProps } from 'react';

const BaseSurface = ({ className, children }: ComponentProps<'div'>) => (
  <div className={cx('bg-backdrop border border-border rounded-lg', className)}>
    {children}
  </div>
);

export default BaseSurface;
