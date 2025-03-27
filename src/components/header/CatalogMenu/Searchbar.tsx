import { Input } from '@/components/ui/input'
import { COLORS } from '@/lib/colors/colors'
import { Search, X } from 'lucide-react'
import React from 'react'

export default function Searchbar() {
  return (
    <div className='relative col-span-7 mb-6'>
        <Search color={COLORS.black} className='size-5 absolute top-1/2 -translate-y-1/2 left-4' strokeWidth={1.25}/>
        <Input className='bg-background border-none rounded-3xl pl-12 text-black' placeholder='Caută...'/>
        <X color={COLORS.black} className='size-5 absolute top-1/2 -translate-y-1/2 right-6' strokeWidth={1.25} />
    </div>
  )
}
