'use client'

import { AdminPages, AdminPagesArr, AdminPagesIcons, useAdminPageStore } from '@/states/AdminPageState'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

export default function AdminSidebar() {
  const t = useTranslations('admin.admin_pages');
  const adminPage = useAdminPageStore((store) => store.page);

  return (
    <div className='col-span-3 bg-black h-screen lg:-ml-16 lg:pl-16 pt-8'>
      <Image src="/logo/logo-blue.svg" alt='logo cado' className='h-12 w-auto' width={196} height={48}/>
      <p className='font-manrope font-semibold leading-5 text-white mt-16 mb-4'>Magazin online</p>
      {
        AdminPagesArr.map((page, index) => {
          return(
            <button key={index} className={`h-12 flex gap-2 items-center pl-6 ${page === adminPage ? "bg-white" : ""}`}>
              {
                AdminPagesIcons[page as AdminPages]
              }
              <p className='text-white leading-5'>{t(page)}</p>
            </button>
          )
        })
      }
    </div>
  )
}