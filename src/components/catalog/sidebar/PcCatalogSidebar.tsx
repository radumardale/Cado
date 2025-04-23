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
import { checkboxUpdateUrlParams, resetUrlParams, updateCategoriesParams } from '@/lib/utils'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

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
}

export default function PcCatalogSidebar({priceState, categoriesState, ocasionsState, productContentState, keywordsState}: CatalogSidebarProps) {
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
    <div data-lenis-prevent className="hidden lg:block scroll-bar-custom col-start-1 col-span-3 h-[calc(100vh-13rem)] overflow-y-scroll mt-12 sticky top-[9rem] pr-4">
      <LayoutGroup>
        <AnimatePresence>
        {
          (categoriesState.category || ocasionsState.ocasions.length > 0 || productContentState.productContent.length > 0 || priceState.price[0] !== 0 || priceState.price[1] !== 5000 || keywordsState.keywords !== null) &&
            <ActiveFilters
              resetAllFilters={(router: AppRouterInstance) => {
                priceState.setPrice([0, 5000]);
                categoriesState.setCategory(null);
                ocasionsState.setOcasions([]);
                productContentState.setProductContent([]);
                resetUrlParams(router);
              }}

              categories={categoriesState.category ? [categoriesState.category] : []}
              updateCategories={(value: Categories, searchParams: URLSearchParams, router: AppRouterInstance) => {
                categoriesState.setCategory(value === categoriesState.category ? null : value);
                updateCategoriesParams(value === categoriesState.category ? [] : [value], searchParams, router);
              }}

              keywords={keywordsState.keywords}
              resetKeywords={(searchParams: URLSearchParams, router: AppRouterInstance) => {
                keywordsState.setKeywords(null);

                const params = new URLSearchParams(searchParams.toString());
                params.delete('keywords');
                
                const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
                router.push(newUrl, {scroll: false});
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
                priceState.setPrice([0, 5000]);

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
    </div>
  )
}