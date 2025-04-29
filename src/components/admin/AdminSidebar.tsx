'use client'

import { Link } from '@/i18n/navigation'
import { AdminPages, AdminPagesArr, AdminPagesIcons, AdminPagesLinks } from '@/lib/enums/AdminPages'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { Fragment } from 'react'

interface AdminSidebarProps {
  page: AdminPages
}

export default function AdminSidebar({ page }: AdminSidebarProps) {
  const t = useTranslations('admin');

  return (
    <div className='col-span-3 bg-black min-h-screen pr-6 lg:-ml-16 lg:pl-16 pt-8'>
      <Image src="/logo/logo-blue.svg" alt='logo cado' className='h-12 w-auto' width={196} height={48}/>
      <p className='font-manrope font-semibold leading-5 text-white mt-16 mb-4'>{t(`sidebar.titles.0`)}</p>
      {
        AdminPagesArr.map((link, index) => {
          return(
            <Fragment key={index}>
              {
                (index === 3 || index === 6) && <p className='font-manrope font-semibold leading-5 text-white my-4 w-full border-t border-lightgray pt-4'>{t(`sidebar.titles.${index}`)}</p>
              }
              <Link href={AdminPagesLinks[link as AdminPages]} className={`h-12 flex gap-2 items-center pl-6 w-full rounded-3xl cursor-pointer transition duration-300 ${link === page ? "bg-white text-black" : "text-white"}`}>
                {
                  AdminPagesIcons[link as AdminPages]
                }
                <p className='leading-5 transition duration-300'>{t(`admin_pages.${link}.title`)}</p>
              </Link>
            </Fragment>
          )
        })
      }
    </div>
  )
}