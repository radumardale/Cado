'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/navigation';
import { Pathnames } from '@/i18n/routing';
import { AdminPages } from '@/lib/enums/AdminPages';
import { ChevronDown, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface AdminHeaderProps {
  page: AdminPages;
  href: Pathnames;
  id?: string;
}

export default function AdminHeader({ page, href, id }: AdminHeaderProps) {
  const locale = useLocale();
  const t = useTranslations('Admin.Sidebar');
  const admin_t = useTranslations('Admin');

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const cleanedPathname =
    pathname === '/ru' || pathname === '/en' || pathname === '/ro'
      ? '/'
      : pathname.replace(/^\/[^/]+\//, '/');

  const usableSearchParams = searchParams.toString() === '' ? '' : `?${searchParams.toString()}`;

  const handleLocaleChange = (newLocale: string) => {
    router.push(`/${newLocale}${cleanedPathname}${usableSearchParams}`);
  };

  return (
    <div className='col-span-12 pt-8 flex justify-between items-center h-fit'>
      <div className='flex'>
        <Link href={href} className='font-manrope text-2xl font-semibold leading-7'>
          {t(`admin_pages.${page}.title`)}
        </Link>
        {id && (
          <p className='font-manrope text-2xl font-semibold leading-7'>
            &nbsp;/ {t(`admin_pages.${page}.item`)} {id}
          </p>
        )}
      </div>
      <div className='flex items-center gap-12'>
        <Select onValueChange={handleLocaleChange} defaultValue={locale}>
          <SelectTrigger className='cursor-pointer flex h-10 max-h-none items-center px-4 gap-2 border border-gray rounded-3xl text-base text-black font-manrope font-semibold'>
            <SelectValue placeholder='Sortează după' />
            <ChevronDown className='size-5' strokeWidth={1.5} />
          </SelectTrigger>
          <SelectContent className='border-gray'>
            <SelectGroup>
              <SelectItem
                className='text-base cursor-pointer font-semibold font-manrope'
                value='ro'
              >
                RO
              </SelectItem>
              <SelectItem
                className='text-base cursor-pointer font-semibold font-manrope'
                value='ru'
              >
                RU
              </SelectItem>
              <SelectItem
                className='text-base cursor-pointer font-semibold font-manrope'
                value='en'
              >
                EN
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <button
          className='h-12 px-6 flex items-center gap-2 bg-black rounded-3xl hover:opacity-75 cursor-pointer transition duration-300'
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className='text-white size-6' strokeWidth={1.5} />
          <p className='text-white'>{admin_t('logout')}</p>
        </button>
      </div>
    </div>
  );
}
