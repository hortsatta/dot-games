import type { ReactNode } from 'react';

import { mainFont } from '#/lib/config/fonts.config';

import './globals.css';

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => (
  <html lang='en' className={`${mainFont.variable}`}>
    <body className='min-h-screen'>
      <main>{children}</main>
    </body>
  </html>
);

export default RootLayout;
