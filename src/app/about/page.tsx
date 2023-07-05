'use client';

import BaseIcon from '#/components/base/base-icon.component';
import BaseScene from '#/components/base/base-scene.component';
import BaseTypography from '#/components/base/base-typography.component';

const AboutPage = () => {
  return (
    <BaseScene>
      <div className='pt-12 max-w-[700px] w-full mx-auto'>
        <BaseTypography>
          <strong className='font-bold'>dotGames</strong> is an e-commerce
          website prototype for playstation exclusive video game products. It is
          written in Typescript and uses the React library and Nextjs framework.
        </BaseTypography>
        <div className='mt-8 w-full flex justify-center'>
          <a
            href='https://github.com/hortsatta/dot-games'
            target='_blank'
            className='px-6 py-2 flex items-center bg-primary/80 rounded-lg hover:bg-primary/100 transition-colors'
          >
            <BaseIcon
              name='github-logo'
              className='mr-1'
              width={24}
              height={24}
            />
            <span>Github Repo</span>
          </a>
        </div>
      </div>
    </BaseScene>
  );
};

export default AboutPage;
