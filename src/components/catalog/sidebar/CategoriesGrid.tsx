import { Categories } from '@/lib/enums/Categories';
import { useTranslations } from 'next-intl';
import React from 'react'

interface CategoriesProps {
    categories: Categories[],
    setCategories: (v: Categories[]) => void
}

export default function CategoriesGrid({categories, setCategories}: CategoriesProps) {
    const t = useTranslations("tags");

    const updateCategory = (value: Categories) => {
        setCategories(
            categories.includes(value) ? 
            categories.filter(item => item !== value) :
              [...categories, value]
          )
    }

  return (
    <>
        <div className="flex gap-2 mb-2">
            <button onClick={() => {updateCategory(Categories.FOR_HER)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-1 rounded-3xl flex items-center transition duration-200 cursor-pointer ${categories.includes(Categories.FOR_HER) ? "opacity-70" : ""}`}>{t("FOR_HER.title")}</button>
            <button onClick={() => {updateCategory(Categories.FOR_HIM)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-2 rounded-3xl flex items-center transition duration-200 cursor-pointer ${categories.includes(Categories.FOR_HIM) ? "opacity-70" : ""}`}>{t("FOR_HIM.title")}</button>
        </div>
        <div className="flex gap-2 mb-2">
            <button onClick={() => {updateCategory(Categories.FOR_KIDS)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-3 rounded-3xl flex items-center transition duration-200 cursor-pointer ${categories.includes(Categories.FOR_KIDS) ? "opacity-70" : ""}`}>{t("FOR_KIDS.title")}</button>
            <button onClick={() => {updateCategory(Categories.ACCESSORIES)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-4 rounded-3xl flex items-center transition duration-200 cursor-pointer ${categories.includes(Categories.ACCESSORIES) ? "opacity-70" : ""}`}>{t("ACCESSORIES.title")}</button>
        </div>
        <div className="flex gap-2">
            <button onClick={() => {updateCategory(Categories.FLOWERS_AND_BALLOONS)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-5 rounded-3xl flex items-center transition duration-200 cursor-pointer ${categories.includes(Categories.FLOWERS_AND_BALLOONS) ? "opacity-70" : ""}`}>{t("FLOWERS_AND_BALLOONS.title")}</button>
            <button onClick={() => {updateCategory(Categories.GIFT_SET)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-2 rounded-3xl flex items-center transition duration-200 cursor-pointer ${categories.includes(Categories.GIFT_SET) ? "opacity-70" : ""}`}>{t("GIFT_SET.title")}</button>
        </div>
    </>
  )
}
