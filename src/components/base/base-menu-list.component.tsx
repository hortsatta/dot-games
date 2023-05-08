import { memo } from 'react';
import { MenuList } from '@material-tailwind/react';
import { cx } from 'classix';

import type { ComponentProps } from 'react';

const BaseMenuList = memo(function BaseMenuList({
  className,
  ...moreProps
}: ComponentProps<typeof MenuList>) {
  return (
    <MenuList
      className={cx(
        'bg-surface border border-border rounded-lg shadow-lg shadow-red-500/10',
        className,
      )}
      {...moreProps}
    />
  );
});

export default BaseMenuList;
