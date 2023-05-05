import { cx } from 'classix';
import type { ComponentProps } from 'react';

import CoreNav from './core-nav.component';

const CoreHeader = ({ className, ...moreProps }: ComponentProps<'header'>) => (
  <header
    className={cx(
      'flex justify-between items-center h-[72px] bg-primary/5 border-b-2 border-primary/[.15]',
      className,
    )}
    {...moreProps}
  >
    <div />
    <CoreNav />
    <div />
  </header>
);

export default CoreHeader;
