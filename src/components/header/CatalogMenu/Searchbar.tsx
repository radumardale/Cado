import { Input } from '@/components/ui/input'
import { useRouter } from '@/i18n/navigation'
import { COLORS } from '@/lib/colors/colors'
import { Search, X } from 'lucide-react'

interface SearchbarProps {
  searchText: string,
  setSearchText: (v: string) => void,
  closeMenu: () => void,
  productsCount: number | undefined | null,
}

export default function Searchbar({searchText, setSearchText, closeMenu, productsCount}: SearchbarProps) {
  const router = useRouter();

  return (
    <div className='relative col-span-7 mb-6'>
        <Search color={COLORS.black} className='size-5 absolute top-1/2 -translate-y-1/2 left-4' strokeWidth={1.25}/>
        <form onSubmit={(e) => {e.preventDefault(); router.push({pathname: "/catalog", query: (productsCount !== undefined && productsCount !== null && productsCount > 0) ? {keywords: searchText.split(/\s+/).filter(word => word.length > 1).join("+")} : undefined}); closeMenu()}}>
          <Input type='text' className='bg-background border-none rounded-3xl pl-12 text-black' placeholder='Caută...'  value={searchText} onChange={(e) => {setSearchText(e.target.value)}} />
        </form>
        <button onClick={() => {setSearchText("")}} className='cursor-pointer size-5 absolute top-1/2 -translate-y-1/2 right-6'>
          <X color={COLORS.black} className='w-full h-full' strokeWidth={1.25}/>
        </button>
    </div>
  )
}