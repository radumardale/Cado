'use client';

import React from 'react';
import BlogGrid from './BlogGrid';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('BlogsPage');
  return (
    <>
      <div className='col-span-full lg:col-start-5 2xl:col-start-6 lg:col-span-7 2xl:col-span-5 mt-16 relative'>
        <h3 className='text-center font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-8 lg:mb-6'>
          {t('title')}
        </h3>
        <p className='text-center mb-4 lg:mb-16 text-sm leading-4 lg:text-base lg:leading-5'>
          {t('description')}
        </p>
      </div>
      <BlogGrid />
    </>
  );
}
