'use client'

import React from 'react'
import LogoCarousel from './LogoCarousel'
import { useTranslations } from 'next-intl'

export default function Reviews() {
  const t = useTranslations('HomePage.Reviews')
  return (
    <>
        <h3 className='col-span-full text-center font-manrope text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase font-semibold mb-8 lg:mb-16'>{t('title')}</h3>
        <LogoCarousel />
    </>
  )
}
