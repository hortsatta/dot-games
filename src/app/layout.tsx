import { siteMetadata } from '#/config/site-metadata.config';
import { mainFont } from '#/config/fonts.config';
import CoreHtml from '#/components/core/core-html.component';
import CoreHeader from '#/components/core/core-header.component';
import CoreNav from '#/components/core/core-nav.component';
import CoreFooter from '#/components/core/core-footer.component';
import CoreSupabaseProvider from '#/components/core/core-supabase-provider';
import CoreToaster from '#/components/core/core-toaster.component';

import 'simplebar-react/dist/simplebar.min.css';
import './globals.css';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata = siteMetadata;

const RootLayout = ({ children }: Props) => (
  <CoreHtml lang='en' className={mainFont.variable}>
    <body className='flex flex-col justify-start w-full min-h-screen bg-white dark:bg-backdrop dark:text-current-dark'>
      <CoreSupabaseProvider>
        <CoreHeader>
          <CoreNav />
        </CoreHeader>
        <main className='flex-1 min-w-full pb-8'>{children}</main>
        <CoreFooter />
      </CoreSupabaseProvider>
      <CoreToaster />
    </body>
  </CoreHtml>
);

export default RootLayout;
