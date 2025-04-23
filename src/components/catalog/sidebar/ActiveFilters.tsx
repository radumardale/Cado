import { useTranslations } from 'next-intl'
import {ActiveFiltersButton} from './ActiveFiltersButton'
import { motion } from 'motion/react'
import { easeInOutCubic } from '@/lib/utils';
import { Categories } from '@/lib/enums/Categories';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter, useSearchParams } from 'next/navigation';

interface ActiveFiltersInterface {
    categories: Categories[],
    updateCategories: (value: Categories, searchParams: URLSearchParams, router: AppRouterInstance) => void,
    ocasions: string[],
    updateOcasions: (value: string, searchParams: URLSearchParams, router: AppRouterInstance) => void,
    productContent: string[],
    updateProductContent: (value: string, searchParams: URLSearchParams, router: AppRouterInstance) => void,
    resetAllFilters: (router: AppRouterInstance) => void,
    price: number[],
    resetPrice: (searchParams: URLSearchParams, router: AppRouterInstance) => void,
    keywords: string | null,
    resetKeywords: (searchParams: URLSearchParams, router: AppRouterInstance) => void,
}

export default function ActiveFilters({categories, updateCategories, ocasions, updateOcasions, productContent, updateProductContent, resetAllFilters, price, resetPrice, keywords, resetKeywords}: ActiveFiltersInterface) {
    const t = useTranslations("");
    const router = useRouter();
    const searchParams = useSearchParams();

  return (
    <motion.div 
        exit={{ height: 0, opacity: 0 }} 
        initial={{height: 0, opacity: 0}} 
        animate={{ height: 'auto', opacity: 1 }} 
        transition={{
            ease: easeInOutCubic, duration: .3,
        }} 
        className='border-b border-lightgray overflow-hidden'>

        <p className='font-semibold font-manrope mb-4 mt-4'>Filtre active</p>
            <div className='flex gap-2 max-w-full flex-wrap mb-4'>
                {
                    keywords !== null && <ActiveFiltersButton key="keyword" title={'"' + keywords.split("+").join(" ") + '"'} onClick={() => {resetKeywords(searchParams, router)}} />
                }
                {
                    categories.map((value, index) => {
                        return (<ActiveFiltersButton key={index} title={t("tags." + value + '.title')} onClick={() => {updateCategories(value, searchParams, router)}} />)
                    })
                }
                {
                    ocasions.map((value, index) => {
                        return (<ActiveFiltersButton key={index} title={t("ocasions." + value)} onClick={() => {updateOcasions(value, searchParams, router)}} />)
                    })
                }
                {
                    productContent.map((value, index) => {
                        return (<ActiveFiltersButton key={index} title={t("product_content." + value)} onClick={() => {updateProductContent(value, searchParams, router)}} />)
                    })
                }
                {(price[0] !== 0 || price[1] !== 5000) && <ActiveFiltersButton title={`${price[0]} - ${price[1]} (MDL)`} onClick={() => {resetPrice(searchParams, router)}}/>}
                <button className='text-gray cursor-pointer p-2' onClick={() => {resetAllFilters(router)}}>
                    <span className='relative after:contetn-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300'>Resetează</span>
                </button>
            </div>
    </motion.div>
  )
}