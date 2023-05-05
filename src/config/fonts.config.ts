import localFont from 'next/font/local';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';

export const mainFont: NextFontWithVariable = localFont({
  variable: '--font-main',
  display: 'swap',
  src: [
    {
      path: '../assets/fonts/tt-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/tt-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/tt-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});
