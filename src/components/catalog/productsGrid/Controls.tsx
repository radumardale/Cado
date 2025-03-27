import { LayoutGrid, TableProperties } from 'lucide-react'
import { ControlsSortSelect } from './ControlsSortSelect'
import SortBy from '@/lib/enums/SortBy'

interface ControlsProps {
    gridLayout: boolean,
    setGridLayout: (v: boolean) => void,
    setSortBy: (v: SortBy) => void
}

export default function Controls({gridLayout, setGridLayout, setSortBy}: ControlsProps) {

  return (
    <div className='col-span-full flex gap-2 justify-end'>
        <ControlsSortSelect setSortBy={setSortBy} />
        <button onClick={() => {setGridLayout(true)}} className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-200 hover:bg-black cursor-pointer ${gridLayout ? "bg-black text-white" : ""} hover:text-white`}>
            <LayoutGrid className='size-5' strokeWidth={1.75}/>
        </button>
        <button onClick={() => {setGridLayout(false)}} className={`size-12 rounded-full border border-black flex justify-center items-center transition duration-200 hover:bg-black cursor-pointer ${gridLayout ? "" : "bg-black text-white"} hover:text-white`}>
            <TableProperties className='size-5' strokeWidth={1.75}/>
        </button>
    </div>
  )
}
