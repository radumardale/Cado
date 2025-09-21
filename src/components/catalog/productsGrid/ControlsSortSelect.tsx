'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import SortBy from '@/lib/enums/SortBy';
import { useTranslations } from 'next-intl';

interface ControlsSortSelectInterface {
  setSortBy: (v: SortBy) => void;
  children: React.ReactNode;
}

export function ControlsSortSelect({ setSortBy, children }: ControlsSortSelectInterface) {
  const t = useTranslations('CatalogPage.ProductsSection');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update URL with sort parameter
  const updateSortUrlParam = useCallback(
    (sortValue: SortBy) => {
      // Create a new URLSearchParams object from the current params
      const params = new URLSearchParams(searchParams.toString());

      // Remove existing sort param
      params.delete('sort_by');

      // Add new sort param if it's not the default
      if (sortValue !== SortBy.RECOMMENDED) {
        params.append('sort_by', sortValue);
      }

      // Update the URL without refreshing the page
      const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
      router.push(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  // Handle sort change
  const handleSortChange = (value: string) => {
    const sortValue = value as SortBy;
    setSortBy(sortValue);
    updateSortUrlParam(sortValue);
  };

  return (
    <Select onValueChange={handleSortChange}>
      <SelectTrigger className='cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl lg:mr-4 text-base text-black font-manrope font-semibold'>
        <ArrowUpDown className='size-5' strokeWidth={1.5} />
        <SelectValue placeholder={t('sort_by')} />
      </SelectTrigger>
      <SelectContent className='border-gray'>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  );
}
