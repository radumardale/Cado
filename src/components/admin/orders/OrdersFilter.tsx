'use client';

import { useOrdersSearchStore } from '@/states/admin/OrdersSearchState';
import Searchbar from '../Searchbar';
import { ControlsSortSelect } from '@/components/catalog/productsGrid/ControlsSortSelect';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format, Locale } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { SelectItem } from '@/components/ui/select';
import SortBy from '@/lib/enums/SortBy';
import { useLocale, useTranslations } from 'next-intl';
import { ro, ru, enUS } from 'date-fns/locale';

export default function OrdersFilter() {
  const setSortBy = useOrdersSearchStore(store => store.setSortBy);
  const searchText = useOrdersSearchStore(store => store.search);
  const setSearchText = useOrdersSearchStore(store => store.setSearch);
  const startDate = useOrdersSearchStore(store => store.startDate);
  const setStartDate = useOrdersSearchStore(store => store.setStartDate);
  const endDate = useOrdersSearchStore(store => store.endDate);
  const setEndDate = useOrdersSearchStore(store => store.setEndDate);

  const locale = useLocale();
  let calLocale: Locale;
  switch (locale) {
    case 'ro':
      calLocale = ro;
      break;
    case 'en':
      calLocale = enUS;
      break;
    case 'ru':
      calLocale = ru;
      break;
    default:
      calLocale = enUS;
      break;
  }

  const t = useTranslations('Admin.AdminOrders');

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
            {t('price_asc')}
          </SelectItem>
          <SelectItem
            className='text-base cursor-pointer font-semibold font-manrope'
            value={SortBy.PRICE_DESC}
          >
            {t('price_desc')}
          </SelectItem>
        </ControlsSortSelect>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                'h-12 pl-6 text-left bg-white rounded-3xl border border-gray text-base hover:bg-white cursor-pointer text-black justify-start font-semibold font-manrope w-fit',
                !startDate && 'text-black'
              )}
            >
              <CalendarIcon className='size-5' strokeWidth={1.25} />
              {startDate ? (
                format(startDate, 'dd/MM/yyyy')
              ) : (
                <span className='mr-auto leading-0'>{t('delivery_date')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              locale={calLocale}
              mode='single'
              selected={startDate}
              onSelect={day => {
                setStartDate(day);
              }}
              weekStartsOn={1}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className='font-semibold font-manrope'>{t('to')}</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                'h-12 pl-6 text-left bg-white rounded-3xl border border-gray text-base hover:bg-white cursor-pointer text-black justify-start font-semibold font-manrope w-fit',
                !endDate && 'text-black'
              )}
            >
              <CalendarIcon className='size-5' strokeWidth={1.25} />
              {endDate ? (
                format(endDate, 'dd/MM/yyyy')
              ) : (
                <span className='mr-auto leading-0'>{t('delivery_date')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              locale={calLocale}
              mode='single'
              selected={endDate}
              onSelect={day => {
                setEndDate(day);
              }}
              disabled={date => date <= (startDate || new Date())}
              weekStartsOn={1}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
