'use client'

import { Link } from '@/i18n/navigation'
import { AdminPages, AdminPagesArr, AdminPagesIcons, AdminPagesLinks } from '@/lib/enums/AdminPages'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { Fragment, useState } from 'react'

interface AdminSidebarProps {
  page: AdminPages
}

export default function AdminSidebar({ page }: AdminSidebarProps) {
  const t = useTranslations('admin');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`col-span-3 fixed xl:relative bg-black min-h-screen pr-16 xl:pr-6 xl:-ml-16 pl-16 xl:pl-16 pt-8 z-[55] xl:translate-0 transition duration-300 ${isOpen ? "translate-0" : "-translate-x-full"}`}>
      <button className='absolute right-4 top-4 xl:hidden cursor-pointer' onClick={() => {setIsOpen(false)}}>
        <X strokeWidth={1.5} className='size-6 text-white'/>
      </button>
      <div className='sticky top-8 h-screen'>
        <button onClick={() => {setIsOpen(true)}} className='absolute h-16 w-4 bg-black -right-16 translate-x-full top-1/2 -translate-y-1/2 rounded-r-lg cursor-pointer xl:hidden'></button>
        <Link href="/" className='w-fit'>
          <Image unoptimized src="/logo/logo-blue.svg" alt='logo cado' className='h-12 w-auto' width={196} height={48}/>
        </Link>
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
    </div>
  )
}