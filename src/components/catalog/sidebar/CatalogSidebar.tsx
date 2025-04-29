import { ProductContent, ProductContentArr } from '@/lib/enums/ProductContent'
import Accordion from './Accordion'
import CategoriesGrid from './CategoriesGrid'
import CheckboxList from './CheckboxList'
import { Ocasions, OcasionsArr } from '@/lib/enums/Ocasions'
import CatalogSlider from './CatalogSlider'
import ActiveFilters from './ActiveFilters'
import { AnimatePresence, LayoutGroup } from 'motion/react'
import { Categories } from '@/lib/enums/Categories'
import { useCallback } from 'react'
import { checkboxUpdateUrlParams, easeInOutCubic, resetUrlParams, updateCategoriesParams } from '@/lib/utils'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useCatalogStore } from '@/states/CatalogState'

interface CatalogSidebarProps {
  keywordsState: {
    keywords: string | null,
    setKeywords: (v: string | null) => void
  },
  productContentState: {
    productContent: ProductContent[],
    setProductContent: (v: ProductContent[]) => void
  },
  ocasionsState: {
    ocasions: Ocasions[],
    setOcasions: (v: Ocasions[]) => void
  },
  priceState: {
    price: number[],
    setPrice: (v: number[]) => void,
  },
  categoriesState: {
    category: Categories | null,
    setCategory: (v: Categories | null) => void
  },
  setSidebarOpen: (v: boolean) => void,
  isSidebarOpen: boolean
}

export default function CatalogSidebar({priceState, categoriesState, ocasionsState, productContentState, setSidebarOpen, isSidebarOpen, keywordsState}: CatalogSidebarProps) {
  const minPrice = useCatalogStore((state) => state.minPrice);
  const maxPrice = useCatalogStore((state) => state.maxPrice);

  const updateOcasions = useCallback((value: Ocasions) => {
    ocasionsState.setOcasions(
      ocasionsState.ocasions.includes(value) 
        ? ocasionsState.ocasions.filter(item => item !== value)
        : [...ocasionsState.ocasions, value]
    );
  }, [ocasionsState.ocasions, ocasionsState.setOcasions]);
  
  const updateProductContent = useCallback((value: ProductContent) => {
    productContentState.setProductContent(
      productContentState.productContent.includes(value) 
        ? productContentState.productContent.filter(item => item !== value)
        : [...productContentState.productContent, value]
    );
  }, [productContentState.productContent, productContentState.setProductContent]);

  return (
    <motion.div 
      initial={{x: '-100%'}}
      animate={isSidebarOpen ? {x: 0, transition: {duration: .4, ease: easeInOutCubic}} : {x: '-100%', transition: {duration: .4, ease: easeInOutCubic}}} 
      data-lenis-prevent 
      className="lg:hidden scroll-bar-custom w-screen lg:w-auto fixed lg:col-start-1 lg:col-span-3 h-full lg:h-[calc(100vh-13rem)] overflow-y-scroll lg:mt-12 lg:sticky left-0 top-0 lg:top-[9rem] pr-4 pl-4 lg:pl-0 z-50 lg:z-10 bg-white pt-16 lg:pt-0">
        <button className='cursor-pointer absolute right-4 top-4 lg:hidden' onClick={() => {setSidebarOpen(false)}}>
            <Plus className='size-5 rotate-45' strokeWidth={1.75} />
        </button>
      <LayoutGroup>
        <AnimatePresence>
        {
          (categoriesState.category || ocasionsState.ocasions.length > 0 || productContentState.productContent.length > 0 || (priceState.price[0] !== minPrice && priceState.price[0] !== 0) || (priceState.price[1] !== maxPrice && priceState.price[1] !== 0) || keywordsState.keywords !== null) &&
            <ActiveFilters
              resetAllFilters={(router: AppRouterInstance) => {
                priceState.setPrice([minPrice, maxPrice]);
                categoriesState.setCategory(null);
                ocasionsState.setOcasions([]);
                productContentState.setProductContent([]);
                resetUrlParams(router);
              }}

              keywords={keywordsState.keywords}
              resetKeywords={(searchParams: URLSearchParams, router: AppRouterInstance) => {
                keywordsState.setKeywords(null);

                const params = new URLSearchParams(searchParams.toString());
                params.delete('keywords');
                
                const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
                router.push(newUrl, {scroll: false});
              }}

              categories={categoriesState.category ? [categoriesState.category] : []}
              updateCategories={(value: Categories, searchParams: URLSearchParams, router: AppRouterInstance) => {
                categoriesState.setCategory(value === categoriesState.category ? null : value);
                updateCategoriesParams(value === categoriesState.category ? [] : [value], searchParams, router);
              }}
        
              ocasions={ocasionsState.ocasions}
              updateOcasions={(value: string, searchParams: URLSearchParams, router: AppRouterInstance) => {
                ocasionsState.setOcasions(
                  ocasionsState.ocasions.filter(item => item !== value)
                )
                checkboxUpdateUrlParams('ocasions', searchParams, router, ocasionsState.ocasions.filter(item => item !== value));
              }} 
        
              productContent={productContentState.productContent}
              updateProductContent={(value: string, searchParams: URLSearchParams, router: AppRouterInstance) => {
                productContentState.setProductContent(productContentState.productContent.filter(item => item !== value))

                checkboxUpdateUrlParams('product_content', searchParams, router, productContentState.productContent.filter(item => item !== value));
              }} 

              price={priceState.price}
              resetPrice={(searchParams: URLSearchParams, router: AppRouterInstance) => {
                priceState.setPrice([minPrice, maxPrice]);

                const params = new URLSearchParams(searchParams.toString());
                params.delete('min_price');
                params.delete('max_price');
                
                const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
                router.push(newUrl, {scroll: false});
              }}
            />
          }
        </AnimatePresence>
        <Accordion title="Categorie">
          <CategoriesGrid 
            category={categoriesState.category} 
            setCategory={(value: Categories | null) => categoriesState.setCategory(value === categoriesState.category ? null : value)} 
          />
        </Accordion>
        <Accordion title="Ocazie">
          <CheckboxList 
            activeValues={ocasionsState.ocasions}
            values={OcasionsArr} 
            translationTitle='ocasions' 
            updateValues={(value: Ocasions | ProductContent) => {
              if (OcasionsArr.includes(value as Ocasions)) {
                updateOcasions(value as Ocasions);
              }
            }} 
          />
        </Accordion>
        <Accordion title="Preț (MDL)">
          <CatalogSlider price={priceState.price} setPrice={priceState.setPrice} />
        </Accordion>
        <Accordion title="Conținut" last>
          <CheckboxList 
            activeValues={productContentState.productContent}
            values={ProductContentArr} 
            translationTitle='product_content' 
            updateValues={(value: Ocasions | ProductContent) => {
              if (ProductContentArr.includes(value as ProductContent)) {
                updateProductContent(value as ProductContent);
              }
            }}  />
        </Accordion>
      </LayoutGroup>

      <button onClick={() => {setSidebarOpen(false)}} className='h-12 w-full bg-blue-2 text-white rounded-3xl font-manrope font-semibold cursor-pointer border mt-10 mb-16'>Actualizează</button>
    </motion.div>
  )
}