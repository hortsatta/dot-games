'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';

const BaseSpinner = memo(function BaseSpinner(props: ComponentProps<'div'>) {
  return (
    <div {...props}>
      <motion.svg
        className='animate-spin'
        preserveAspectRatio='none'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 32 32'
      >
        <g>
          <path
            className='opacity-40'
            d='M16,5A11,11,0,1,1,5,16,11,11,0,0,1,16,5m0-5A16,16,0,1,0,32,16,16,16,0,0,0,16,0Z'
            fill='white'
          />
          <path
            className='opacity-80'
            fill='white'
            d='M16,5V0A16,16,0,0,0,4.69,27.31l3.54-3.54A11,11,0,0,1,16,5Z'
          />
        </g>
      </motion.svg>
    </div>
  );
});

export default BaseSpinner;
