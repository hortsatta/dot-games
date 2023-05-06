import { ComponentProps, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cx } from 'classix';

import logoSrc from '#/assets/images/logo.png';

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
      <Image src={logoSrc} alt='logo' width={176} height={29} quality={100} />
    </Link>
  );
});

export default CoreLogo;
