import { useTRPC } from '@/app/_trpc/client'
import { ProductInterface } from '@/models/product/types/productInterface'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import AdminReccSearchbar from './AdminReccSearchbar'
import { Pin } from 'lucide-react'

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

interface AdminRecommnendationsSearchProps {
    replaceProduct: ProductInterface,
    handleRefresh: () => void,
    closePopup: () => void,
}

export default function AdminRecommnendationsSearch({replaceProduct, handleRefresh, closePopup}: AdminRecommnendationsSearchProps) {
    const trpc = useTRPC();
    const locale = useLocale();
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [localProducts, setLocalProducts] = useState<ProductInterface[]>([]);
    const [localCount, setLocalCount] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<ProductInterface | null>(null)

    const [searchText, setSearchText] = useState('');
    const [queryText, setQueryText] = useState('');
    const { data } = useQuery(trpc.search.queryOptions(
      { title: queryText },
      { 
        enabled: queryText.length > 1,
        staleTime: 30000, 
        gcTime: 60000, 
      }
    ));
    const { mutate, isSuccess } = useMutation(trpc.products.updateRecProduct.mutationOptions());

    useEffect(() => {
        if (!isSuccess) return;

        closePopup();
        handleRefresh();
    }, [isSuccess])

    const submitProduct = () => {
        if (!selectedProduct?._id) return;

        mutate({
            replaceId: replaceProduct._id,
            productId: selectedProduct._id
        });
    }

    useEffect(() => {
        if (closeTimeoutRef?.current) clearTimeout(closeTimeoutRef?.current);
    
        closeTimeoutRef.current = setTimeout(() => {
          setQueryText(searchText);
        }, 200)
    
        return () => {
          if (closeTimeoutRef?.current) clearTimeout(closeTimeoutRef?.current);
        };
      }, [searchText])

    useEffect(() => {
        if (data?.products) {
            setLocalProducts(data?.products);
            setLocalCount(data?.count);
        }
    }, [data?.products])

    const t = useTranslations("Admin.AdminHomePage");

    return (
      <>
          <AdminReccSearchbar searchText={searchText} setSearchText={setSearchText}/>
          <div className='col-span-full h-full lg:h-80 lg:mx-auto z-50 pb-12 box-content border-b border-lightgray mb-12'>
              <div className='col-span-full relative h-full'>
                  {
                      localCount == 0 &&
                      <div className='absolute left-1/2 top-1/2 -translate-1/2 w-full lg:w-auto px-13 lg:px-0 flex flex-col items-center'>
                          <Image src="/icons/shopping-bag-sad.svg" alt='sad shopping bag' width={48} height={48} className='size-12 translate-y-12' />
                          <p className='mt-2 text-sm leading-4 lg:leading-5 lg:text-base text-center mb-12 translate-y-12'>{t("no_match")}</p>
                      </div>
                  }
                  <div className='grid grid-cols-2 lg:flex gap-x-2 gap-y-6 lg:gap-y-0 lg:w-228'>
                      {
                          selectedProduct &&
                          <div className='w-44 flex flex-col group'>
                              <div className='relative overflow-hidden before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:transition before:duration-300 before:z-10 mb-2 border-4 border-blue-2 rounded-2xl'>
                                  {
                                      selectedProduct.sale && selectedProduct.sale.active &&
                                      <div className='absolute top-2 right-2 h-8 flex items-center justify-center bg-red px-4 rounded-3xl text-white z-[5]'>
                                          <span className='font-semibold text-xs leading-3.5'>{t("discount")}</span>
                                      </div>
                                  }
                                  <div className='w-full aspect-[339/425] bg-purewhite rounded-lg lg:rounded-2xl opacity-100 group-hover:opacity-0 overflow-hidden transition duration-300 z-10 flex items-center relative'>
                                      <Image src={selectedProduct.images[0]} width={798} height={1198} alt={selectedProduct.title.ro} className='w-full max-h-full object-contain'/>  
                                  </div>
                                  <div className='absolute left-0 top-0 h-full w-full rounded-lg lg:rounded-2xl transition duration-300 z-0 bg-purewhite flex items-center'>
                                      <Image src={selectedProduct.images[1] || selectedProduct.images[0]} width={798} height={1198} alt={selectedProduct.title.ro} className={`w-full max-h-full object-contain`}/>  
                                  </div>
                                  <button onClick={(e) => {e.stopPropagation()}} className='absolute right-2 top-2 rounded-3xl font-manrope z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold'>
                                      <Pin strokeWidth={1.5} fill='white' className='size-4 text-white' />
                                  </button>
                              </div>
                              <div className='group cursor-pointer flex flex-col flex-1 justify-between'>
                                  <p className={`font-manrope font-semibold mb-2 text-left text-sm leading-4`}>{selectedProduct.title[locale]}</p>
                                  <div className={`flex gap-1 items-center`}>
                                      {
                                          selectedProduct.sale && selectedProduct.sale.active &&
                                          <p className='text-gray text-sm leading-4 font-semibold line-through'>{selectedProduct.price.toLocaleString()} MDL</p>
                                      }
                                      <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit px-2 py-1.5`}>{selectedProduct.sale && selectedProduct.sale.active ? selectedProduct.sale.sale_price.toLocaleString() : selectedProduct.price.toLocaleString()} MDL</div>
                                  </div>
                              </div>
                          </div>
                      }
                      {
                          localCount > 0 &&
                          localProducts.map((product, index) => {
                              if (selectedProduct && index >= 4) return;
                              return (
                                  <div key={index} className='w-44 flex flex-col group'>
                                      <div className='relative overflow-hidden before:content-[""] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-pureblack before:opacity-0 group-hover:before:opacity-25 before:rounded-lg before:lg:rounded-2xl before:transition before:duration-300 before:z-10 mb-2'>
                                          {
                                              product.sale && product.sale.active &&
                                              <div className='absolute top-2 right-2 h-8 flex items-center justify-center bg-red px-4 rounded-3xl text-white z-[5]'>
                                                  <span className='font-semibold text-xs leading-3.5'>Reducere</span>
                                              </div>
                                          }
                                          <div className='w-full aspect-[339/425] bg-purewhite rounded-lg lg:rounded-2xl opacity-100 group-hover:opacity-0 overflow-hidden transition duration-300 z-10 flex items-center relative'>
                                              <Image src={product.images[0]} width={798} height={1198} alt={product.title.ro} className='w-full max-h-full object-contain'/>  
                                          </div>
                                          <div className='absolute left-0 top-0 h-full w-full rounded-lg lg:rounded-2xl transition duration-300 z-0 bg-purewhite flex items-center'>
                                              <Image src={product.images[1] || product.images[0]} width={798} height={1198} alt={product.title.ro} className={`w-full max-h-full object-contain`}/>  
                                          </div>
                                          <button onClick={(e) => {e.stopPropagation(); setSelectedProduct(product)}} className='absolute right-2 top-2 rounded-3xl font-manrope z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold cursor-pointer'>
                                              <Pin strokeWidth={1.5} className='size-4 text-white' />
                                          </button>
                                      </div>
                                      <div className='group flex flex-col flex-1 justify-between'>
                                          <p className={`font-manrope font-semibold mb-2 text-left text-sm leading-4`}>{product.title[locale]}</p>
                                          <div className={`flex gap-1 items-center`}>
                                              {
                                                  product.sale && product.sale.active &&
                                                  <p className='text-gray text-sm leading-4 font-semibold line-through'>{product.price.toLocaleString()} MDL</p>
                                              }
                                              <div className={`font-manrope font-semibold border border-gray rounded-3xl w-fit px-2 py-1.5`}>{product.sale && product.sale.active ? product.sale.sale_price.toLocaleString() : product.price.toLocaleString()} MDL</div>
                                          </div>
                                      </div>
                                  </div>
                              )
                          }) 
                      }
                  </div>
              </div>
          </div>
          <div className='col-span-full flex justify-end'>
              <button disabled={!selectedProduct} onClick={submitProduct} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-blue-2 text-white rounded-3xl hover:opacity-75 transition duration-300'>{t('modify_prod')}</button>
          </div>
      </>
    )
}
