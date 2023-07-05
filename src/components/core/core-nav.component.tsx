import { memo } from 'react';

import BaseNavItem from '../base/base-nav-item.component';
import BaseIcon from '../base/base-icon.component';
import CoreWishListNav from './core-wish-list-nav.component';
import CoreCartNav from './core-cart-nav.component';

import mainMenuJson from '#/main-menu.json';

import type { IconName } from '../base/base-icon.component';

const CoreNav = memo(function CoreNav() {
  return (
    <nav className='flex justify-center items-center h-full'>
      <CoreCartNav to='/cart' tooltip='Cart' />
      <CoreWishListNav to='/wish-list' tooltip='Wish List' />
      {mainMenuJson.map(({ to, icon, isExternal, label }) => (
        <BaseNavItem key={to} to={to} isExternal={isExternal} tooltip={label}>
          <BaseIcon
            name={icon as IconName}
            className='dark:fill-current-dark/100'
            width={28}
            height={28}
          />
        </BaseNavItem>
      ))}
      {/* <CoreSearchNav to='/search' tooltip='Search' /> */}
    </nav>
  );
});

export default CoreNav;
