'use client';

import Searchbar from '../Searchbar';
import { ControlsSortSelect } from '@/components/catalog/productsGrid/ControlsSortSelect';
import { SelectItem } from '@/components/ui/select';
import SortBy from '@/lib/enums/SortBy';
import { useClientSearchStore } from '@/states/admin/ClientsSearchState';
import { useTranslations } from 'next-intl';

export default function ClientFilter() {
  const setSortBy = useClientSearchStore(store => store.setSortBy);
  const searchText = useClientSearchStore(store => store.search);
  const setSearchText = useClientSearchStore(store => store.setSearch);

  const t = useTranslations('Admin.AdminClientData');

  return (
    <>
      <Searchbar
        className='col-span-5 mt-16'
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div className='mt-16 col-span-7 flex gap-1 lg:gap-2 justify-end items-center'>
        <ControlsSortSelect setSortBy={setSortBy}>
          <SelectItem
            className='text-base cursor-pointer font-semibold font-manrope'
            value={SortBy.LATEST}
          >
            {t('new')}
          </SelectItem>
          <SelectItem
            className='text-base cursor-pointer font-semibold font-manrope'
            value={SortBy.OLDEST}
          >
            {t('old')}
          </SelectItem>
          <SelectItem
            className='text-base cursor-pointer font-semibold font-manrope'
            value={SortBy.PRICE_ASC}
          >
            {t('orders_asc')}
          </SelectItem>
          <SelectItem
            className='text-base cursor-pointer font-semibold font-manrope'
            value={SortBy.PRICE_DESC}
          >
            {t('orders_desc')}
          </SelectItem>
        </ControlsSortSelect>
      </div>
    </>
  );
}
