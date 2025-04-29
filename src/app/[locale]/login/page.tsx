'use client'
/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useState } from 'react'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

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

  return (
    <>
      <div className='bg-black absolute left-0 top-0 w-full h-full z-0'></div>
      <div className='col-start-6 col-span-5 justify-center z-10 h-screen grid grid-cols-5'>
        <div className='col-span-full bg-white h-fit grid grid-cols-5 my-auto py-12 rounded-3xl'>            
            <form onSubmit={(e) => {e.preventDefault(); logIn();}} className='z-50 h-fit bg-white col-start-2 col-span-3'>
              <Image src="/logo/logo-black.svg" alt='logo cado' className='h-12 w-auto mx-auto' width={196} height={48}/>
              <Input className="mt-8 mb-4 h-12 w-full px-6 rounded-3xl text-base text-black border-gray shadow-none placeholder:text-black" placeholder='Username*' value={username} onChange={(e) => {setUsername(e.currentTarget.value)}}/>

              <div className='w-full relative'>
                <button className='absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer' onClick={(e) => {e.preventDefault(); setPasswordVisible(!isPasswordVisible)}}>
                  {
                    !isPasswordVisible ? <Eye className='size-5' /> : <EyeOff className='size-5' />
                  }
                </button>
                <Input type={isPasswordVisible ? "text" : "password"} className="mb-8 h-12 w-full pl-6 pr-14 rounded-3xl text-base text-black border-gray shadow-none placeholder:text-black" placeholder='Password*' value={password} onChange={(e) => {setPassword(e.currentTarget.value)}}/>
              </div>
              
              <button className='w-full text-center bg-black h-12 text-white rounded-3xl font-manrope font-semibold cursor-pointer hover:opacity-75 transition duration-300'>Log In</button>
            </form>
        </div>
      </div>
    </>
  )
}
