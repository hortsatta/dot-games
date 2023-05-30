import { memo } from 'react';
import { Dialog } from '@material-tailwind/react';
import { cx } from 'classix';

import type { ComponentProps } from 'react';

const BaseDialog = memo(function BaseDialog({
  className,
  size = 'xs',
  ...moreProps
}: ComponentProps<typeof Dialog>) {
  return (
    <Dialog
      className={cx('bg-transparent overflow-hidden', className)}
      size={size}
      {...moreProps}
    />
  );
});

export default BaseDialog;
