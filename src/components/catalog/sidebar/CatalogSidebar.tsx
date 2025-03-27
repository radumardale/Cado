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

interface CatalogSidebarProps {
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
    categories: Categories[],
    setCategories: (v: Categories[]) => void
  },
}

export default function CatalogSidebar({priceState, categoriesState, ocasionsState, productContentState}: CatalogSidebarProps) {
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
    <div data-lenis-prevent className="col-start-1 col-span-3 h-[calc(100vh-5rem)] overflow-y-scroll mt-12 sticky top-20 pr-4">
      <LayoutGroup>
        <AnimatePresence>
        {
          (categoriesState.categories.length > 0 || ocasionsState.ocasions.length > 0 || productContentState.productContent.length > 0 || priceState.price[0] !== 0 || priceState.price[1] !== 5000) &&
            <ActiveFilters
              resetAllFilters={() => {
                priceState.setPrice([0, 5000]);
                categoriesState.setCategories([]);
                ocasionsState.setOcasions([]);
                productContentState.setProductContent([]);
              }}
              categories={categoriesState.categories}
              updateCategories={(value: Categories) => {
                categoriesState.setCategories(categoriesState.categories.filter(item => item !== value))
              }}
        
              ocasions={ocasionsState.ocasions}
              updateOcasions={(value: string) => {
              ocasionsState.setOcasions(
                ocasionsState.ocasions.filter(item => item !== value)
              )
              }} 
        
              productContent={productContentState.productContent}
              updateProductContent={(value: string) => {
                productContentState.setProductContent(productContentState.productContent.filter(item => item !== value))
              }} 

              price={priceState.price}
              resetPrice={() => {
                priceState.setPrice([0, 5000]);
              }}
            />
          }
        </AnimatePresence>
        <Accordion title="Categorie">
          <CategoriesGrid categories={categoriesState.categories} setCategories={categoriesState.setCategories} />
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
          <CatalogSlider setPrice={priceState.setPrice} />
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