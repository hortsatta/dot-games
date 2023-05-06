import { memo } from 'react';
import { cx } from 'classix';

import AuthSignDialog from '../auth/auth-sign-dialog.componen';
import CoreLogo from './core-logo.component';

import type { ComponentProps } from 'react';

const CoreHeader = memo(function CoreHeader({
  className,
  children,
  ...moreProps
}: ComponentProps<'header'>) {
  return (
    <>
      <header
        className={cx(
          'sticky flex justify-between items-center h-[72px] bg-primary/5 border-b-2 border-primary/[.15]',
          className,
        )}
        {...moreProps}
      >
        <div className='max-w-[250px] w-full'>
          <AuthSignDialog />
        </div>
        {children}
        <div className='flex justify-end max-w-[250px] w-full'>
          <CoreLogo href='/' />
        </div>
      </header>
    </>
  );
});

export default CoreHeader;
