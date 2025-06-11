'use client'

import { Input } from '@/components/ui/input'
import { COLORS } from '@/lib/colors/colors'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SearchbarProps {
  searchText: string,
  setSearchText: (v: string) => void,
  className?: string
}

export default function Searchbar({searchText, setSearchText, className}: SearchbarProps) {

  const t = useTranslations("Admin.AdminClientData")

  return (
    <div className={`relative h-12 ${className}`}>
        <Search color={COLORS.black} className='size-5 absolute top-1/2 -translate-y-1/2 left-4' strokeWidth={1.25}/>
        <Input type='text' className='h-12 bg-background border-none rounded-3xl pl-12 text-black' placeholder={`${t('search')}...`}  value={searchText} onChange={(e) => {setSearchText(e.target.value)}} />
        <button onClick={(e) => {e.preventDefault();setSearchText("")}} className='cursor-pointer size-5 absolute top-1/2 -translate-y-1/2 right-6'>
          <X color={COLORS.black} className='w-full h-full' strokeWidth={1.25}/>
        </button>
    </div>
  )
}