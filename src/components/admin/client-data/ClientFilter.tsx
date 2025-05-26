'use client'

import Searchbar from '../Searchbar'
import { ControlsSortSelect } from '@/components/catalog/productsGrid/ControlsSortSelect';
import { SelectItem } from '@/components/ui/select';
import SortBy from '@/lib/enums/SortBy';
import { useClientSearchStore } from '@/states/admin/ClientsSearchState';


export default function ClientFilter() {
    const setSortBy = useClientSearchStore((store) => store.setSortBy);
    const searchText = useClientSearchStore((store) => store.search);
    const setSearchText = useClientSearchStore((store) => store.setSearch);

  return (
    <>
        <Searchbar className='col-span-5 mt-16' searchText={searchText} setSearchText={setSearchText}/>
        <div className='mt-16 col-span-7 flex gap-1 lg:gap-2 justify-end items-center'>
            <ControlsSortSelect setSortBy={setSortBy}>
              <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.LATEST}>Clienți noi</SelectItem>
              <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.OLDEST}>Clienți vechi</SelectItem>
              <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_ASC}>Nr comenzi: Mic la Mare</SelectItem>
              <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_DESC}>Nr comenzi: Mare la Mic</SelectItem>
            </ControlsSortSelect>
        </div>
    </>
  )
}
