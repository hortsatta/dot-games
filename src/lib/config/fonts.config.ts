import localFont from 'next/font/local';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';

const BASE_PATH = '../../assets/fonts';

export const mainFont: NextFontWithVariable = localFont({
  variable: '--font-main',
  display: 'swap',
  src: [
    {
      path: `${BASE_PATH}/tt-400.woff2`,
      weight: '400',
      style: 'normal',
    },
    {
      path: `${BASE_PATH}/tt-500.woff2`,
      weight: '500',
      style: 'normal',
    },
    {
      path: `${BASE_PATH}/tt-700.woff2`,
      weight: '700',
      style: 'normal',
    },
  ],
});
