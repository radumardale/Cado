'use client'

import Searchbar from '../Searchbar'
import { ControlsSortSelect } from '@/components/catalog/productsGrid/ControlsSortSelect'
import { LayoutGrid, TableProperties } from 'lucide-react'
import { useProductsSearchStore } from '@/states/admin/ProductsSearchState'
import { SelectItem } from '@/components/ui/select'
import SortBy from '@/lib/enums/SortBy'

export default function ProductsFilter() {
    const setSortBy = useProductsSearchStore((store) => store.setSortBy);
    const gridLayout = useProductsSearchStore((store) => store.gridLayout);
    const setGridLayout = useProductsSearchStore((store) => store.setGridLayout);
    const searchText = useProductsSearchStore((store) => store.search);
    const setSearchText = useProductsSearchStore((store) => store.setSearch);

  return (
    <>
        <Searchbar className='col-span-5 mt-16' searchText={searchText} setSearchText={setSearchText}/>
        <div className='mt-16 col-span-7 flex gap-1 lg:gap-2 justify-end'>
            <ControlsSortSelect setSortBy={setSortBy}>
                <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.LATEST}>Produse noi</SelectItem>
                <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.OLDEST}>Produse vechi</SelectItem>
                <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_ASC}>Preț: Mic la Mare</SelectItem>
                <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_DESC}>Preț: Mare la Mic</SelectItem>
            </ControlsSortSelect>
            <button onClick={() => {setGridLayout(true)}} className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer ${gridLayout ? "bg-black text-white" : ""} hover:text-white`}>
                <LayoutGrid className='size-5' strokeWidth={1.75}/>
            </button>
            <button onClick={() => {setGridLayout(false)}} className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer ${gridLayout ? "" : "bg-black text-white"} hover:text-white`}>
                <TableProperties className='size-5' strokeWidth={1.75}/>
            </button>
        </div>
    </>
  )
}
