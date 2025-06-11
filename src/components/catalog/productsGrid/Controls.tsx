import { LayoutGrid, SlidersHorizontal, TableProperties } from 'lucide-react'
import { ControlsSortSelect } from './ControlsSortSelect'
import SortBy from '@/lib/enums/SortBy'
import { SelectItem } from '@/components/ui/select'
import { useTranslations } from 'next-intl'

interface ControlsProps {
    gridLayout: boolean,
    setGridLayout: (v: boolean) => void,
    setSortBy: (v: SortBy) => void,
    setSidebarOpen: (v: boolean) => void,
    isSidebarOpen: boolean,
    searchText: string | null,
    countProducts: number
}

export default function Controls({gridLayout, setGridLayout, setSortBy, setSidebarOpen, isSidebarOpen, searchText, countProducts}: ControlsProps) {
  const t = useTranslations("CatalogPage.ProductsSection.sort_options")

  return (
    <div className='col-span-full flex gap-1 lg:gap-2 justify-end sticky lg:relative top-14 lg:top-auto py-2 lg:py-0 left-0 z-40 bg-white lg:z-auto lg:bg-transparent items-center'>
        {searchText && <h2 className='font-manrope text-2xl leading-7 uppercase font-semibold mr-auto'>{countProducts} {countProducts === 1 ? "REZULTAT" : "REZULTATE"} CU “{searchText.split("+").join(" ")}”</h2>}
        <div className='flex gap-1 lg:gap-2 w-full lg:w-auto'>
            <button onClick={() => {setSidebarOpen(true)}} className={`lg:hidden mr-auto size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer ${isSidebarOpen ? "bg-black text-white" : ""} hover:text-white`}>
                <SlidersHorizontal className='size-5' strokeWidth={1.75}/>
            </button>
            <ControlsSortSelect setSortBy={setSortBy}>
                <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.RECOMMENDED}>{t("recommended")}</SelectItem>
                <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.LATEST}>{t("new")}</SelectItem>
                <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_ASC}>{t("price_asc")}</SelectItem>
                <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_DESC}>{t("price_desc")}</SelectItem>
            </ControlsSortSelect>
            <button onClick={() => {setGridLayout(true)}} className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer ${gridLayout ? "bg-black text-white" : ""} hover:text-white`}>
                <LayoutGrid className='size-5' strokeWidth={1.75}/>
            </button>
            <button onClick={() => {setGridLayout(false)}} className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer ${gridLayout ? "" : "bg-black text-white"} hover:text-white`}>
                <TableProperties className='size-5' strokeWidth={1.75}/>
            </button>
        </div>
    </div>
  )
}