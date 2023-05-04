'use client';

import { ThemeProvider } from '@material-tailwind/react';
import { cx } from 'classix';
import type { ComponentProps } from 'react';

const CoreHtml = ({
  className,
  children,
  ...moreProps
}: ComponentProps<'html'>) => (
  <html className={cx(className, '')} {...moreProps}>
    <ThemeProvider>{children}</ThemeProvider>
  </html>
);

export default CoreHtml;
