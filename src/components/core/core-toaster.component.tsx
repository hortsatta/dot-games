'use client';

import { memo } from 'react';
import { Toaster } from 'react-hot-toast';
import type { ComponentProps } from 'react';

const style = { zIndex: 99999 };
const toastOptions = { className: 'toaster', duration: 4000 };

const CoreToaster = memo(function CoreToaster(
  props: ComponentProps<typeof Toaster>,
) {
  return (
    <Toaster
      position='bottom-center'
      containerStyle={style}
      containerClassName='toaster-wrapper'
      toastOptions={toastOptions}
      {...props}
    />
  );
});

export default CoreToaster;
