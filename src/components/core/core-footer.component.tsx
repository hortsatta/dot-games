import { memo } from 'react';
import Image from 'next/image';
import { cx } from 'classix';

import logoPng from '#/assets/images/logo.png';

import type { ComponentProps } from 'react';

const currentYear = new Date().getFullYear();

const CoreFooter = memo(function CoreFooter({
  className,
}: ComponentProps<'footer'>) {
  return (
    <footer
      className={cx(
        'relative pt-12 pb-16 px-4 flex flex-col items-center bg-[#101010] z-50',
        className,
      )}
    >
      <Image
        src={logoPng}
        alt='logo'
        className='mb-4'
        width={176}
        height={29}
        quality={100}
      />
      <p className='text-center text-xs leading-snug'>
        <span>© {currentYear} New Game Corporation. All rights reserved.</span>
        <br />
        <span>
          All trademarks are property of their respective owners in the US and
          other countries.
        </span>
      </p>
    </footer>
  );
});

export default CoreFooter;
