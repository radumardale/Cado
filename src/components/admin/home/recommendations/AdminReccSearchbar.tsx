import { Input } from '@/components/ui/input';
import { COLORS } from '@/lib/colors/colors';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminReccSearchbarProps {
  searchText: string;
  setSearchText: (v: string) => void;
}

export default function AdminReccSearchbar({ searchText, setSearchText }: AdminReccSearchbarProps) {
  const t = useTranslations('Admin.AdminHomePage');

  return (
    <div className='relative col-span-7 mb-12'>
      <Search
        color={COLORS.black}
        className='size-5 absolute top-1/2 -translate-y-1/2 left-4'
        strokeWidth={1.25}
      />
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <Input
          type='text'
          className='bg-background border-none rounded-3xl pl-12 text-black'
          placeholder={`${t('search')}...`}
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value);
          }}
        />
      </form>
      <button
        onClick={() => {
          setSearchText('');
        }}
        className='cursor-pointer size-5 absolute top-1/2 -translate-y-1/2 right-6'
      >
        <X color={COLORS.black} className='w-full h-full' strokeWidth={1.25} />
      </button>
    </div>
  );
}
