'use client'
/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';


export default function AdminPage() {

  const t = useTranslations("LoginPage")

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const [displayAdmin, setDisplayAdmin] = useState(true)

  const logIn = async () => {
    const response: any = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    if(response.ok) {
      router.push('/admin')
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
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

    const admin_t = useTranslations('Admin')

  return (
    <>
    {
      displayAdmin ? (
        <div className="grid grid-cols-8 md:grid-cols-15 gap-x-2 md:gap-x-6 px-4 md:px-16 max-w-3xl mx-auto">
          <div className='bg-black absolute left-0 top-0 w-full h-full z-0'></div>
          <div className='col-start-6 col-span-5 justify-center z-10 h-screen grid grid-cols-5'>
            <div className='col-span-full bg-white h-fit grid grid-cols-5 my-auto py-12 rounded-3xl'>            
                <form onSubmit={(e) => {e.preventDefault(); logIn();}} className='z-50 h-fit bg-white col-start-2 col-span-3'>
                  <Image unoptimized src="/logo/logo-black.svg" alt='logo cado' className='h-12 w-auto mx-auto' width={196} height={48}/>
                  <Input className="mt-8 mb-4 h-12 w-full px-6 rounded-3xl text-base text-black border-gray shadow-none placeholder:text-black" placeholder={`${t('username')}*`} value={username} onChange={(e) => {setUsername(e.currentTarget.value)}}/>

                  <div className='w-full relative'>
                    <button className='absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer' onClick={(e) => {e.preventDefault(); setPasswordVisible(!isPasswordVisible)}}>
                      {
                        !isPasswordVisible ? <Eye className='size-5' /> : <EyeOff className='size-5' />
                      }
                    </button>
                    <Input type={isPasswordVisible ? "text" : "password"} className="mb-8 h-12 w-full pl-6 pr-14 rounded-3xl text-base text-black border-gray shadow-none placeholder:text-black" placeholder={`${t('password')}*`} value={password} onChange={(e) => {setPassword(e.currentTarget.value)}}/>
                  </div>
                  
                  <button className='w-full text-center bg-black h-12 text-white rounded-3xl font-manrope font-semibold cursor-pointer hover:opacity-75 transition duration-300'>{t('login')}</button>
                </form>
            </div>
          </div>
        </div>
      ) : (
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
            <p className='text-base font-roboto font-[400] text-darkblue mt-[1rem] text-center'>{admin_t("unsupported_device")}</p>
            <p className='text-base font-roboto font-[400] text-darkblue mt-[1rem] text-center'>{admin_t("unsupported_device_message")}</p>
          </div> 
        </div>
      )
    }
    </>
  )
}
