import { memo } from 'react';

import BaseIcon from '../base/base-icon.component';
import BaseNavItem from '../base/base-nav-item.component';

import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof BaseNavItem>, 'children'>;

const CoreSearchNav = memo(function CoreCartNav({ to, ...moreProps }: Props) {
  return (
    <BaseNavItem to={to} {...moreProps}>
      <BaseIcon
        name='magnifying-glass'
        className='dark:fill-current-dark/100'
        width={28}
        height={28}
      />
    </BaseNavItem>
  );
});

export default CoreSearchNav;
