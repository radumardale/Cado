'use client'

import React, { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function Template ({ children } : { children : React.ReactNode }) {

  const t = useTranslations('Admin')

  const [showAdmin, setShowAdmin] = useState(false)
  const [displayAdmin, setDisplayAdmin] = useState(true)

  const router = useRouter()

  const { data, status } = useSession()
  const user = data?.user

  useEffect(() => {
    if(status !== 'loading'){
      if (user) {
         setShowAdmin(true)
      } else {
        router.push('/login')
      }
    }
  }, [user, router, status])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setDisplayAdmin(true)
      } else {
        setDisplayAdmin(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (status === 'loading') {
    return null
  }

  return (
    <>
    {
      displayAdmin ? showAdmin && children
      : (
          <div className='fixed inset-0 flex items-center justify-center bg-darkblue px-4'>
            <div className="bg-white rounded-[1rem] max-w-2xl w-full p-[3rem] flex flex-col items-center justify-center">
              <Image 
                src="/logo/logo-black.svg"
                alt="logo"
                width={196}
                height={48}
                className="w-[12.25rem]"
              />

              <Image 
                src="/icons/error-icon.svg"
                alt="error icon"
                width={32}
                height={32}
                className="w-8 h-8 mt-[2rem]"
              />
              <p className='text-base font-roboto font-[400] text-darkblue mt-[1rem] text-center'>{t("unsupported_device")}</p>
              <p className='text-base font-roboto font-[400] text-darkblue mt-[1rem] text-center'>{t("unsupported_device_message")}</p>
            </div> 
          </div>
      )
    }

    </>
  )
}
