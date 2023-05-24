import { AnimatePresence, motion } from 'framer-motion';
import { cx } from 'classix';

import BaseSpinner from '#/components/base/base-spinner.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  loading?: boolean;
};

const animate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const BaseScene = ({ className, loading, ...moreProps }: Props) => (
  <>
    <AnimatePresence>
      {loading && (
        <motion.div
          className='absolute top-0 left-0 w-full min-h-[702px] h-full bg-backdrop/50 z-50'
          {...animate}
        >
          <BaseSpinner className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10' />
        </motion.div>
      )}
    </AnimatePresence>
    <div className={cx('pt-[72px]', className)} {...moreProps} />
  </>
);

export default BaseScene;
