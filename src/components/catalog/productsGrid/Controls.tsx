import { LayoutGrid, SlidersHorizontal, TableProperties } from 'lucide-react'
import { ControlsSortSelect } from './ControlsSortSelect'
import SortBy from '@/lib/enums/SortBy'

interface ControlsProps {
    gridLayout: boolean,
    setGridLayout: (v: boolean) => void,
    setSortBy: (v: SortBy) => void,
    sortBy: SortBy,
    setSidebarOpen: (v: boolean) => void,
    isSidebarOpen: boolean
}

export default function Controls({gridLayout, setGridLayout, setSortBy, sortBy, setSidebarOpen, isSidebarOpen}: ControlsProps) {

  return (
    <div className='col-span-full flex gap-1 lg:gap-2 justify-end'>
        <button onClick={() => {setSidebarOpen(true)}} className={`lg:hidden mr-auto size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer ${isSidebarOpen ? "bg-black text-white" : ""} hover:text-white`}>
            <SlidersHorizontal className='size-5' strokeWidth={1.75}/>
        </button>
        <ControlsSortSelect setSortBy={setSortBy} currentSort={sortBy}/>
        <button onClick={() => {setGridLayout(true)}} className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer ${gridLayout ? "bg-black text-white" : ""} hover:text-white`}>
            <LayoutGrid className='size-5' strokeWidth={1.75}/>
        </button>
        <button onClick={() => {setGridLayout(false)}} className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-300 hover:bg-black cursor-pointer ${gridLayout ? "" : "bg-black text-white"} hover:text-white`}>
            <TableProperties className='size-5' strokeWidth={1.75}/>
        </button>
    </div>
  )
}
