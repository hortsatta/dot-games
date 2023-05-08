import { cx } from 'classix';
import type { ComponentProps } from 'react';

const BaseSurface = ({ className, children }: ComponentProps<'div'>) => (
  <div className={cx('bg-surface border border-border rounded-lg', className)}>
    {children}
  </div>
);

export default BaseSurface;
