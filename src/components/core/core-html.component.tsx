'use client';

import { ThemeProvider } from '@material-tailwind/react';
import { cx } from 'classix';
import { useBoundStore } from '#/hooks/use-store.hook';

import type { ComponentProps } from 'react';

const CoreHtml = ({
  className,
  children,
  ...moreProps
}: ComponentProps<'html'>) => {
  const isDarkMode = useBoundStore((state) => state.isDarkMode);

  return (
    <html className={cx(className, isDarkMode && 'dark')} {...moreProps}>
      <ThemeProvider>{children}</ThemeProvider>
    </html>
  );
};

export default CoreHtml;
