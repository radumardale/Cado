'use client'

import { useOrdersSearchStore } from '@/states/admin/OrdersSearchState';
import Searchbar from '../Searchbar'
import { ControlsSortSelect } from '@/components/catalog/productsGrid/ControlsSortSelect';
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { SelectItem } from '@/components/ui/select';
import SortBy from '@/lib/enums/SortBy';


export default function OrdersFilter() {
    const setSortBy = useOrdersSearchStore((store) => store.setSortBy);
    const searchText = useOrdersSearchStore((store) => store.search);
    const setSearchText = useOrdersSearchStore((store) => store.setSearch);
    const startDate = useOrdersSearchStore((store) => store.startDate);
    const setStartDate = useOrdersSearchStore((store) => store.setStartDate);
    const endDate = useOrdersSearchStore((store) => store.endDate);
    const setEndDate = useOrdersSearchStore((store) => store.setEndDate);

  return (
    <>
        <Searchbar className='col-span-5 mt-16' searchText={searchText} setSearchText={setSearchText}/>
        <div className='mt-16 col-span-7 flex gap-1 lg:gap-2 justify-end items-center'>
            <ControlsSortSelect setSortBy={setSortBy}>
              <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.LATEST}>Comenzi noi</SelectItem>
              <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.OLDEST}>Comenzi vechi</SelectItem>
              <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_ASC}>Preț: Mic la Mare</SelectItem>
              <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_DESC}>Preț: Mare la Mic</SelectItem>
            </ControlsSortSelect>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                className={cn(
                    "h-12 pl-6 text-left bg-white rounded-3xl border border-gray text-base hover:bg-white cursor-pointer text-black justify-start font-semibold font-manrope w-fit",
                    !startDate && "text-black"
                )}
                >
                <CalendarIcon className="size-5" strokeWidth={1.25} />
                {startDate ? (
                    format(startDate, "dd/MM/yyyy")
                ) : (
                    <span className='mr-auto leading-0'>Data de livrare</span>
                )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(day) => {setStartDate(day)}}
                  weekStartsOn={1}
                  initialFocus
              />
              </PopoverContent>
            </Popover>
            <p className='font-semibold font-manrope'>până la</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                className={cn(
                    "h-12 pl-6 text-left bg-white rounded-3xl border border-gray text-base hover:bg-white cursor-pointer text-black justify-start font-semibold font-manrope w-fit",
                    !endDate && "text-black"
                )}
                >
                <CalendarIcon className="size-5" strokeWidth={1.25} />
                {endDate ? (
                  format(endDate, "dd/MM/yyyy")
                ) : (
                  <span className='mr-auto leading-0'>Data de livrare</span>
                )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(day) => {setEndDate(day)}}
                  disabled={(date) =>
                      date <= (startDate || new Date())
                  }
                  weekStartsOn={1}
                  initialFocus
              />
              </PopoverContent>
            </Popover>
        </div>
    </>
  )
}
