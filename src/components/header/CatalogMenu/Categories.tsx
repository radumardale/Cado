import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

export function Categories() {
    const t = useTranslations("tags");

  return (
    <div className='col-span-3'>
        <p className='font-manrope font-semibold mb-4'>Categorii</p>
        <div className="flex gap-2 mb-2">
            <Link href={{pathname: '/catalog', query: {category: "FOR_HER"}}} className='h-12 px-6 text-white font-manrope font-semibold bg-blue-1 rounded-3xl flex items-center hover:opacity-75 transition duration-300'>{t("FOR_HER.title")}</Link>
            <Link href={{pathname: '/catalog', query: {category: "FOR_HIM"}}} className='h-12 px-6 text-white font-manrope font-semibold bg-blue-2 rounded-3xl flex items-center hover:opacity-75 transition duration-300'>{t("FOR_HIM.title")}</Link>
        </div>
        <div className="flex gap-2 mb-2">
            <Link href={{pathname: '/catalog', query: {category: "FOR_KIDS"}}} className='h-12 px-6 text-white font-manrope font-semibold bg-blue-3 rounded-3xl flex items-center hover:opacity-75 transition duration-300'>{t("FOR_KIDS.title")}</Link>
            <Link href={{pathname: '/catalog', query: {category: "ACCESSORIES"}}} className='h-12 px-6 text-white font-manrope font-semibold bg-blue-4 rounded-3xl flex items-center hover:opacity-75 transition duration-300'>{t("ACCESSORIES.title")}</Link>
        </div>
        <div className="flex gap-2 mb-2">
            <Link href={{pathname: '/catalog', query: {category: "FLOWERS_AND_BALLOONS"}}} className='h-12 px-6 text-white font-manrope font-semibold bg-blue-5 rounded-3xl flex items-center hover:opacity-75 transition duration-300'>{t("FLOWERS_AND_BALLOONS.title")}</Link>
            <Link href={{pathname: '/catalog', query: {category: "GIFT_SET"}}} className='h-12 px-6 text-white font-manrope font-semibold bg-blue-2 rounded-3xl flex items-center hover:opacity-75 transition duration-300'>{t("GIFT_SET.title")}</Link>
        </div>
        <Link href="/catalog" className='h-12 px-6 font-manrope font-semibold border border-black rounded-3xl flex items-center w-fit transition duration-300 hover:bg-black hover:text-white'>{t("ALL_PRODUCTS.title")}</Link>
    </div>
  )
}
