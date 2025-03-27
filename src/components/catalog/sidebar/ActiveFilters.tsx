import { useTranslations } from 'next-intl'
import {ActiveFiltersButton} from './ActiveFiltersButton'
import { motion } from 'motion/react'
import { easeInOutCubic } from '@/lib/utils';
import { Categories } from '@/lib/enums/Categories';

interface ActiveFiltersInterface {
    categories: Categories[],
    updateCategories: (v: Categories) => void,
    ocasions: string[],
    updateOcasions: (v: string) => void,
    productContent: string[],
    updateProductContent: (v: string) => void,
    resetAllFilters: () => void,
    price: number[],
    resetPrice: () => void
}

export default function ActiveFilters({categories, updateCategories, ocasions, updateOcasions, productContent, updateProductContent, resetAllFilters, price, resetPrice}: ActiveFiltersInterface) {
    const t = useTranslations("");

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
                    categories.map((value, index) => {
                        return (<ActiveFiltersButton key={index} title={t("tags." + value)} onClick={() => {updateCategories(value)}} />)
                    })
                }
                {
                    ocasions.map((value, index) => {
                        return (<ActiveFiltersButton key={index} title={t("ocasions." + value)} onClick={() => {updateOcasions(value)}} />)
                    })
                }
                {
                    productContent.map((value, index) => {
                        return (<ActiveFiltersButton key={index} title={t("product_content." + value)} onClick={() => {updateProductContent(value)}} />)
                    })
                }
                {(price[0] !== 0 || price[1] !== 5000) && <ActiveFiltersButton title={`${price[0]} - ${price[1]} (MDL)`} onClick={resetPrice}/>}
                <button className='text-gray underline cursor-pointer p-2' onClick={resetAllFilters}>Resetează</button>
            </div>
    </motion.div>
  )
}

