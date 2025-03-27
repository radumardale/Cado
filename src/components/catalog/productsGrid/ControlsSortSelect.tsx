import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"
import SortBy from "@/lib/enums/SortBy"

interface ControlsSortSelectInterface {
  setSortBy: (v: SortBy) => void
}

export function ControlsSortSelect({setSortBy}: ControlsSortSelectInterface) {
  return (
    <Select onValueChange={(value) => setSortBy(value as SortBy)}>
      <SelectTrigger className="cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl mr-4 text-base text-black font-manrope font-semibold">
      <ArrowUpDown className='size-5' strokeWidth={1.5}/>
      <SelectValue placeholder="Sortează după" />
      </SelectTrigger>
      <SelectContent className="border-gray">
      <SelectGroup>
        <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.RECOMMENDED}>Recomandate</SelectItem>
        <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.LATEST}>Produse noi</SelectItem>
        <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_ASC}>Preț: Mic la Mare</SelectItem>
        <SelectItem className="text-base cursor-pointer font-semibold font-manrope" value={SortBy.PRICE_DESC}>Preț: Mare la Mic</SelectItem>
      </SelectGroup>
      </SelectContent>
    </Select>
  )
}
