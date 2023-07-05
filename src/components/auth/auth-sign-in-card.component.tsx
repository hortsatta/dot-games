import { memo } from 'react';
import cx from 'classix';

import BaseIcon from '../base/base-icon.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  onSignIn: () => void;
  labelAppend?: string;
};

const AuthSignInCard = memo(function AuthSignUpComplete({
  className,
  onSignIn,
  labelAppend,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('w-full flex flex-col items-center', className)}
      {...moreProps}
    >
      <BaseIcon
        name='user-focus'
        className='mb-4 fill-current-dark/80'
        width={56}
        height={56}
      />
      <span>
        <a className='underline cursor-pointer' onClick={onSignIn}>
          Sign in
        </a>{' '}
        {labelAppend}
      </span>
    </div>
  );
});

export default AuthSignInCard;
