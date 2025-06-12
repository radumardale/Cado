import LinkMenuWrapper from '@/components/catalog/LinkMenuWrapper'
import LoadingGrid from '@/components/catalog/productsGrid/LoadingGrid'
// import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { Select, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { ArrowUpDown, LayoutGrid, SlidersHorizontal, TableProperties } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return (
    <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
        <div className="grid grid-cols-full gap-x-6 col-span-full">
            <Header category={undefined} breadcrumbs />
            <div className="relative col-span-full grid grid-cols-full gap-x-2 lg:gap-x-6 mb-24">
                <div className='col-span-full lg:col-start-4 2xl:col-start-4 lg:col-span-10 2xl:col-span-12 grid grid-cols-8 lg:grid-cols-12 mt-16 lg:mt-12 gap-x-2 lg:gap-y-6 lg:gap-6 h-fit'>
                    <div className='col-span-full flex gap-1 lg:gap-2 justify-end sticky lg:relative top-14 lg:top-auto py-2 lg:py-0 left-0 z-40 bg-white lg:z-auto lg:bg-transparent items-center'>
                        <div className='flex gap-1 lg:gap-2 w-full lg:w-auto'>
                            <button className={`lg:hidden mr-auto size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer hover:text-white`}>
                                <SlidersHorizontal className='size-5' strokeWidth={1.75}/>
                            </button>
                            <Select>
                                <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl lg:mr-4 text-base text-black font-manrope font-semibold">
                                    <ArrowUpDown className='size-5' strokeWidth={1.5}/>
                                    <SelectValue placeholder="Sortează după" />
                                </SelectTrigger>
                            </Select>
                            <button className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer hover:text-white bg-black text-white`}>
                                <LayoutGrid className='size-5' strokeWidth={1.75}/>
                            </button>
                            <button className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer hover:text-white`}>
                                <TableProperties className='size-5' strokeWidth={1.75}/>
                            </button>
                        </div>
                    </div>
                    <div className='col-span-full grid grid-cols-8 lg:grid-cols-12 gap-x-2 gap-y-6 lg:gap-6'>
                        <LoadingGrid gridLayout={true} length={8}/> 
                    </div>
                </div>
            </div>
            <LinkMenuWrapper /> 
        </div>
        {/* <Footer /> */}
    </div>
    )
}
