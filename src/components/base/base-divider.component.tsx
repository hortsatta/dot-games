import { cx } from 'classix';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'hr'> & {
  isHorizontal?: boolean;
};

const BaseDivider = ({ className, isHorizontal, ...moreProps }: Props) => {
  return (
    <hr
      className={cx(
        'dark:border-white/25',
        isHorizontal && 'w-[1px] h-full border-0 border-l-[1px]',
        className,
      )}
      {...moreProps}
    />
  );
};

export default BaseDivider;
