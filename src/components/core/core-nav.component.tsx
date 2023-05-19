import { memo } from 'react';

import BaseNavItem from '../base/base-nav-item.component';
import BaseIcon from '../base/base-icon.component';
import CoreWishListNav from './core-wish-list-nav.component';
import CoreCartNav from './core-cart-nav.component';
import CoreSearchNav from './core-search-nav.component';

import mainMenuJson from '#/main-menu.json';

import type { IconName } from '../base/base-icon.component';

const CoreNav = memo(function CoreNav() {
  return (
    <nav className='flex justify-center items-center h-full'>
      <CoreCartNav to='/cart' />
      <CoreWishListNav to='/wish-list' />
      {mainMenuJson.map(({ to, icon }) => (
        <BaseNavItem key={to} to={to}>
          <BaseIcon
            name={icon as IconName}
            className='dark:fill-current-dark/100'
            width={28}
            height={28}
          />
        </BaseNavItem>
      ))}
      <CoreSearchNav to='/search' />
    </nav>
  );
});

export default CoreNav;
