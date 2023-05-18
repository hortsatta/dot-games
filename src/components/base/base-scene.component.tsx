import { cx } from 'classix';
import type { ComponentProps } from 'react';

const BaseScene = ({ className, ...moreProps }: ComponentProps<'div'>) => (
  <div className={cx('pt-[72px]', className)} {...moreProps} />
);

export default BaseScene;
