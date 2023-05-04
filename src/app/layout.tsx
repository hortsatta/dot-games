import type { ReactNode } from 'react';

import { mainFont } from '#/lib/config/fonts.config';
import CoreHtml from '#/components/core/core-html.component';

import './globals.css';

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => (
  <CoreHtml lang='en' className={mainFont.variable}>
    <body className='min-h-screen bg-white dark:bg-black'>
      <main>{children}</main>
    </body>
  </CoreHtml>
);

export default RootLayout;
