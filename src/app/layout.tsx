import { mainFont } from '#/config/fonts.config';
import CoreHtml from '#/components/core/core-html.component';
import CoreHeader from '#/components/core/core-header.component';
import CoreNav from '#/components/core/core-nav.component';
import CoreSupabaseProvider from '#/components/core/core-supabase-provider';
import './globals.css';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => (
  <CoreHtml lang='en' className={mainFont.variable}>
    <body className='min-h-screen bg-white dark:bg-backdrop dark:text-current-dark'>
      <CoreSupabaseProvider>
        <CoreHeader>
          <CoreNav />
        </CoreHeader>
        <main>{children}</main>
      </CoreSupabaseProvider>
    </body>
  </CoreHtml>
);

export default RootLayout;
