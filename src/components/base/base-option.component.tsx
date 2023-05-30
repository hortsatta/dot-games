import { forwardRef, memo } from 'react';
import { Option } from '@material-tailwind/react';
import { cx } from 'classix';

import type { ComponentProps } from 'react';

const BaseOption = memo(
  forwardRef<HTMLLIElement, ComponentProps<typeof Option>>(function BaseOption(
    { className, ...moreProps },
    ref,
  ) {
    return (
      <Option
        ref={ref}
        className={cx('hover:!bg-primary hover:!text-current-dark', className)}
        {...moreProps}
      />
    );
  }),
);

export default BaseOption;
