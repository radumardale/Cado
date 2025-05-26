import { Categories } from '@/lib/enums/Categories';
import { updateCategoriesParams } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoriesProps {
    category: Categories | null,
    setCategory: (v: Categories | null) => void
}

export default function CategoriesGrid({category, setCategory}: CategoriesProps) {
    const t = useTranslations("tags");
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const updateCategory = (value: Categories) => {
        // If the same category is clicked again, deselect it, otherwise select the new one
        const newCategory = category === value ? null : value;
            
        // Update local state
        setCategory(newCategory);
        
        // Update URL params
        updateCategoriesParams(newCategory ? [newCategory] : [], searchParams, router);
    }

  return (
    <>
        <div className="flex lg:flex-col xl:flex-row lg:w-fit xl:w-auto gap-2 mb-2">
            <button onClick={() => {updateCategory(Categories.FOR_HER)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-1 rounded-3xl flex items-center transition duration-300 cursor-pointer hover:opacity-75 ${category === Categories.FOR_HER ? "opacity-70" : ""}`}>{t("FOR_HER.title")}</button>
            <button onClick={() => {updateCategory(Categories.FOR_HIM)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-2 rounded-3xl flex items-center transition duration-300 cursor-pointer hover:opacity-75 ${category === Categories.FOR_HIM ? "opacity-70" : ""}`}>{t("FOR_HIM.title")}</button>
        </div>
        <div className="flex lg:flex-col xl:flex-row lg:w-fit xl:w-auto gap-2 mb-2">
            <button onClick={() => {updateCategory(Categories.FOR_KIDS)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-3 rounded-3xl flex items-center transition duration-300 cursor-pointer hover:opacity-75 ${category === Categories.FOR_KIDS ? "opacity-70" : ""}`}>{t("FOR_KIDS.title")}</button>
            <button onClick={() => {updateCategory(Categories.ACCESSORIES)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-4 rounded-3xl flex items-center transition duration-300 cursor-pointer hover:opacity-75 ${category === Categories.ACCESSORIES ? "opacity-70" : ""}`}>{t("ACCESSORIES.title")}</button>
        </div>
        <div className="flex lg:flex-col xl:flex-row lg:w-fit xl:w-auto gap-2">
            <button onClick={() => {updateCategory(Categories.FLOWERS_AND_BALLOONS)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-5 rounded-3xl flex items-center transition duration-300 cursor-pointer hover:opacity-75 ${category === Categories.FLOWERS_AND_BALLOONS ? "opacity-70" : ""}`}>{t("FLOWERS_AND_BALLOONS.title")}</button>
            <button onClick={() => {updateCategory(Categories.GIFT_SET)}} className={`h-12 px-6 text-white font-manrope font-semibold bg-blue-2 rounded-3xl flex items-center transition duration-300 cursor-pointer hover:opacity-75 ${category === Categories.GIFT_SET ? "opacity-70" : ""}`}>{t("GIFT_SET.title")}</button>
        </div>
    </>
  )
}
