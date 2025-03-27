import React from 'react'
import Searchbar from './Searchbar'
import { Categories } from './Categories'
import Ocasions from './Ocasions'
import ViewCategory from './ViewCategory'
import Image from 'next/image'

interface CatalogMenuProps {
  setIsCatalogMenuActive: (v: boolean) => void
}

export default function CatalogMenu({setIsCatalogMenuActive}: CatalogMenuProps) {
  return (
    <div className='col-start-1 col-span-full grid lg:grid-cols-13 2xl:grid-cols-full gap-x-6 pt-4 pb-6 relative z-50' onMouseEnter={() => {setIsCatalogMenuActive(true)}} onMouseLeave={() => {setIsCatalogMenuActive(false)}}>
      <Image src="/ribbon/left-bottom-ribbon.png" className='absolute left-0 bottom-0 w-[13vw]' width={242} height={225} alt='ribbon' />
      <div className='grid gap-x-6 grid-cols-7 col-span-7 col-start-4'>
        <Searchbar />
        <Categories />
        <Ocasions />
        <ViewCategory />
      </div>
      <Image src="/ribbon/left-bottom-ribbon.png" className='absolute right-0 bottom-0 w-[13vw] rotate-y-180' width={242} height={225} alt='ribbon' />
    </div>
  )
}
