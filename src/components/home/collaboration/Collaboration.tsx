'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

export default function Collaboration() {
  const t = useTranslations('HomePage.Collaboration');

  return (
    <>
      <h3 className='col-span-full text-center font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-8 lg:mb-6'>
        {t('title')}
      </h3>
      <p className='col-span-full lg:col-start-6 lg:col-span-5 leading-4 lg:leading-5 text-sm lg:text-base text-center mb-4 lg:mb-12'>
        {t('description')}
      </p>
      <div className='col-span-full grid grid-cols-15 gap-x-6 mb-42 gap-y-2 lg:gap-y-0'>
        <CollaborationCard
          index={1}
          title={t('card1.title')}
          description={t('card1.description')}
        />
        <CollaborationCard
          index={2}
          title={t('card2.title')}
          description={t('card2.description')}
        />
        <CollaborationCard
          index={3}
          title={t('card3.title')}
          description={t('card3.description')}
        />
        <CollaborationCard
          index={4}
          title={t('card4.title')}
          description={t('card4.description')}
        />
        <CollaborationCard
          index={5}
          title={t('card5.title')}
          description={t('card5.description')}
        />
      </div>
    </>
  );
}

const CollaborationCard = ({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) => {
  return (
    <div
      className='rounded-2xl lg:rounded-3xl xl:aspect-square col-span-full lg:col-span-3 relative flex flex-col justify-start xl:justify-end lg:gap-3 2xl:gap-4 p-4 lg:p-6 2xl:p-8'
      style={{ backgroundColor: `var(--blue${index})` }}
    >
      <div className='flex items-center mb-4 gap-6'>
        <span className='lg:absolute left-8 top-12 text-white font-manrope text-[4rem] lg:hidden xl:block xl:text-[5rem] 2xl:text-8xl leading-14 lg:leading-8 xl:leading-9 font-semibold'>
          {index}
        </span>
        <p className='text-white font-manrope text-2xl 2xl:text-[2rem] font-semibold leading-7 2xl:leading-9 uppercase whitespace-nowrap overflow-hidden text-ellipsis'>
          {title.split('|')[0]} <br /> {title.split('|')[1]}
        </p>
      </div>
      <p className='text-white text-sm leading-4 lg:leading-5 lg:text-base'>{description}</p>
    </div>
  );
};
