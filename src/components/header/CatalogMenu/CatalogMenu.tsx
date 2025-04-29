'use client'

import React, { useEffect, useRef, useState } from 'react'
import Searchbar from './Searchbar'
import { Categories } from './Categories'
import Ocasions from './Ocasions'
import ViewCategory from './ViewCategory'
import Image from 'next/image'
import { trpc } from '@/app/_trpc/client'
import SearchProducts from './SearchProducts'

interface CatalogMenuProps {
  setIsCatalogMenuActive: (v: boolean) => void
}

export default function CatalogMenu({setIsCatalogMenuActive}: CatalogMenuProps) {
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchText, setSearchText] = useState('');
  const [queryText, setQueryText] = useState('');
  const recProducts = trpc.products.getRecProduct.useQuery()
  const { data, isLoading } = trpc.search.useQuery(
    { title: queryText },
    { 
      enabled: queryText.length > 1,
      staleTime: 30000, 
      gcTime: 60000, 
    }
  );

  useEffect(() => {
    if (closeTimeoutRef?.current) clearTimeout(closeTimeoutRef?.current);

    closeTimeoutRef.current = setTimeout(() => {
      setQueryText(searchText);
    }, 200)

    return () => {
      if (closeTimeoutRef?.current) clearTimeout(closeTimeoutRef?.current);
    };
  }, [searchText])

  const closeMenu = () => {
    setIsCatalogMenuActive(false);
  }

  return (
    <div className={`hidden lg:grid col-start-1 col-span-full lg:grid-cols-13 2xl:grid-cols-full gap-x-6 pt-4 ${searchText.length < 2 ? "pb-6" : "pb-0"} relative z-50`} onMouseEnter={() => {setIsCatalogMenuActive(true)}} onMouseLeave={() => {setIsCatalogMenuActive(false)}}>
        <Image src="/ribbon/left-bottom-ribbon.png" className='absolute left-0 bottom-0 w-[13vw]' width={242} height={225} alt='ribbon' />
      <div className='grid gap-x-6 grid-cols-7 col-span-7 col-start-4'>
        <Searchbar searchText={searchText} setSearchText={setSearchText} closeMenu={closeMenu} productsCount={data?.count}/>
        { 
            searchText.length < 2 ?
            <>
              <Categories />
              <Ocasions />
              <ViewCategory />
            </>
            :
            <SearchProducts isLoading={isLoading} productsCount={data?.count} products={data?.products} recProducts={recProducts.data?.products} searchText={searchText} closeMenu={closeMenu}/>
        }
      </div>
      <Image src="/ribbon/left-bottom-ribbon.png" className='absolute right-0 bottom-0 w-[13vw] rotate-y-180' width={242} height={225} alt='ribbon' />
    </div>
  )
}
