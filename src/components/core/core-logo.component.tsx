import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cx } from 'classix';

import logoPng from '#/assets/images/logo.png';

import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link> & {
  href?: string;
};

const CoreLogo = memo(function CoreLogo({ className, ...moreProps }: Props) {
  return (
    <Link
      className={cx(
        'flex items-center inline-block w-fit h-full px-7',
        className,
      )}
      {...moreProps}
    >
      <Image src={logoPng} alt='logo' width={176} height={29} quality={100} />
    </Link>
  );
});

export default CoreLogo;
