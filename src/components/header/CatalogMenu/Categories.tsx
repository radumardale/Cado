import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

export function Categories() {
    const t = useTranslations("tags");

  return (
    <div className='col-span-3'>
        <p className='font-manrope font-semibold mb-4'>Categorii</p>
        <div className="flex gap-2 mb-2">
            <Link href="#" className='h-12 px-6 text-white font-manrope font-semibold bg-blue-1 rounded-3xl flex items-center'>{t("FOR_HER")}</Link>
            <Link href="#" className='h-12 px-6 text-white font-manrope font-semibold bg-blue-2 rounded-3xl flex items-center'>{t("FOR_HIM")}</Link>
        </div>
        <div className="flex gap-2 mb-2">
            <Link href="#" className='h-12 px-6 text-white font-manrope font-semibold bg-blue-3 rounded-3xl flex items-center'>{t("FOR_KIDS")}</Link>
            <Link href="#" className='h-12 px-6 text-white font-manrope font-semibold bg-blue-4 rounded-3xl flex items-center'>{t("ACCESSORIES")}</Link>
        </div>
        <div className="flex gap-2 mb-2">
            <Link href="#" className='h-12 px-6 text-white font-manrope font-semibold bg-blue-5 rounded-3xl flex items-center'>{t("FLOWERS_AND_BALLOONS")}</Link>
            <Link href="#" className='h-12 px-6 text-white font-manrope font-semibold bg-blue-2 rounded-3xl flex items-center'>{t("GIFT_SET")}</Link>
        </div>
        <Link href="#" className='h-12 px-6 font-manrope font-semibold border border-black rounded-3xl flex items-center w-fit'>{t("ALL_PRODUCTS")}</Link>
    </div>
  )
}
