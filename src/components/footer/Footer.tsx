'use client'

import { Link } from '@/i18n/navigation'
import { useLenis } from 'lenis/react'
import { ArrowUp } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CustomLink from '../CustomLink'
import { default as NextLink } from 'next/link'

export default function Footer() {
    const lenis = useLenis();

  return (
    <div className='bg-blue-2 -ml-4 lg:-ml-16 w-[calc(100%+2rem)] lg:w-[calc(100%+8rem)] overflow-hidden lg:overflow-auto col-span-full grid grid-cols-8 lg:grid-cols-15 pt-16 lg:pt-24 relative'>
        <div className='bg-blue-2 absolute left-1/2 -translate-x-1/2 top-0 h-full w-[calc(100vw-1rem)] -z-10'></div>
        <div className='col-span-full grid grid-cols-8 lg:grid-cols-15 px-4 lg:px-16'>
            <div className='col-span-full lg:col-start-2 lg:col-span-4 order-1'>
                <Image src="/logo/logo-blue.svg" alt='logo' width={228} height={56} className='h-14 mb-6 hidden lg:block' />
                <p className='text-white text-center lg:text-left text-sm leading-4 lg:leading-5 lg:text-base'>
                    Căutați să surprindeți clienții sau să-i încântați pe cei dragi? <br className='hidden lg:block'/><br className='hidden lg:block'/>
                    Oferim cele mai bune soluții pentru orice ocazie. Explorează opțiunile noastre exclusive și găsește potrivirea perfectă pentru tine!
                </p>
                <div className="flex mt-4 lg:mt-6 gap-4 mx-auto justify-center lg:justify-start mb-12 lg:mb-0">
                    <Image src="/icons/paymentMethod/Visa.svg" alt="visa logo" width={47} height={32} className='w-12 h-8' />
                    <Image src="/icons/paymentMethod/Mastercard.svg" alt="Mastercard logo" width={47} height={32} className='w-12 h-8' />
                    <Image src="/icons/paymentMethod/Qiwi.svg" alt="Qiwi logo" width={47} height={32} className='w-12 h-8' />
                    <Image src="/icons/paymentMethod/Yandex.svg" alt="Yandex logo" width={47} height={32} className='w-12 h-8' />
                    <Image src="/icons/paymentMethod/Bitcoin.svg" alt="Bitcoin logo" width={47} height={32} className='w-12 h-8' />
                </div>
            </div>

            <div className='col-span-3 lg:col-start-7 lg:col-span-2 order-2'>
                <p className='text-white font-manrope text-base lg:text-2xl leading-5 lg:leading-7 font-semibold mb-4 lg:mb-6'>Navigare</p>
                <CustomLink href="/" className="text-white block text-sm lg:text-base mb-2 lg:mb-4" value="Acasă"/>
                <CustomLink href="/catalog" className="text-white block text-sm lg:text-base mb-2 lg:mb-4" value="Catalog"/>
                <CustomLink href="/about-us" className="text-white block text-sm lg:text-base mb-2 lg:mb-4" value="Despre Noi"/>
                <CustomLink href="/blogs" className="text-white block text-sm lg:text-base mb-2 lg:mb-4" value="Blog"/>
                <CustomLink href="/contacts" className="text-white block text-sm lg:text-base mb-2 lg:mb-4" value="Contacte"/>
            </div>

            <div className='col-start-5 col-span-4 lg:col-span-2 lg:col-start-auto order-3'>
                <p className='text-white font-manrope text-base lg:text-2xl leading-5 lg:leading-7 font-semibold mb-4 lg:mb-6'>Contacte</p>
                <a href="tel:+37369645153" className="text-white block text-sm lg:text-base mb-2 lg:mb-4">+373 69 645 153</a>
                <a href="tel:+37369645153" className="text-white block text-sm lg:text-base mb-2 lg:mb-4">+373 69 645 153</a>
                <a href="tel:+40774075088" className="text-white block text-sm lg:text-base mb-2 lg:mb-4">+40 774 075 088</a>
                <p className="text-white block text-sm lg:text-base mb-2 lg:mb-4">Suport: info@cado.md</p>
                <p className="text-white block text-sm lg:text-base">Comenzi: order@cado.md</p>
            </div>

            <div className='col-start-5 col-span-4 lg:col-span-2 lg:col-start-auto lg:pr-4 mt-8 lg:mt-0 order-5 lg:order-4'>
                <p className='text-white font-manrope text-base lg:text-2xl leading-5 lg:leading-7 font-semibold mb-4 lg:mb-6'>Adrese</p>
                <p className="text-white block text-sm lg:text-base mb-2 lg:mb-4">Moldova, Chișinău, str. Alecu Russo 15, of. 59</p>
                <p className="text-white block text-sm lg:text-base">România, Brașov, str. Ceferiștilor 65</p>
            </div>

            <div className='col-span-3 order-4 lg:order-5 mt-8 lg:mt-0'>
                <p className='text-white font-manrope text-base lg:text-2xl leading-5 lg:leading-7 font-semibold mb-4 lg:mb-6'>Urmărește-ne</p>
                <div className="flex gap-2 lg:gap-4 flex-wrap">
                    <NextLink href="/" className='border border-white bg-white lg:bg-transparent lg:hover:bg-white min-w-8 min-h-8 flex justify-center items-center rounded-full footer-link'>
                        <Image src="/icons/instagram.svg" alt="instagram logo" width={16} height={16} className='size-4' />
                    </NextLink>
                    <NextLink href="/" className='border border-white bg-white lg:bg-transparent lg:hover:bg-white min-w-8 min-h-8 flex justify-center items-center rounded-full footer-link'>
                        <Image src="/icons/facebook.svg" alt="facebook logo" width={16} height={16} className='size-4' />
                    </NextLink>
                    <NextLink href="/" className='border border-white bg-white lg:bg-transparent lg:hover:bg-white min-w-8 min-h-8 flex justify-center items-center rounded-full footer-link'>
                        <Image src="/icons/tiktok.svg" alt="tiktok logo" width={16} height={16} className='size-4' />
                    </NextLink>
                    <NextLink href="/" className='border border-white bg-white lg:bg-transparent lg:hover:bg-white min-w-8 min-h-8 flex justify-center items-center rounded-full footer-link'>
                        <Image src="/icons/pinterest.svg" alt="pinterest logo" width={16} height={16} className='size-4' />
                    </NextLink>
                    <NextLink href="/" className='border border-white bg-white lg:bg-transparent lg:hover:bg-white min-w-8 min-h-8 flex justify-center items-center rounded-full footer-link'>
                        <Image src="/icons/linkedin.svg" alt="linkedin logo" width={16} height={16} className='size-4' />
                    </NextLink>
                </div>
            </div>

            <div className="flex justify-center col-span-full mt-12 mb-16 lg:mb-6 order-6">
                <button className='bg-white size-12 flex justify-center items-center rounded-full cursor-pointer' onClick={() => {lenis?.scrollTo(0)}}>
                    <ArrowUp className='text-blue-2 size-8' />
                </button>
            </div>
        </div>
        <Image src="/footer/ribbon-screen.png" alt="footer ribbon" width={1920} height={326} className='col-span-full -ml-22 lg:ml-0 w-[calc(100%+11rem)] lg:w-full max-w-none lg:max-w-full'/>
        <div className="col-span-full lg:col-start-2 lg:col-span-13 pt-4 lg:pt-0 gap-2 lg:gap-0 pb-6 lg:pb-0 flex lg:justify-between flex-col lg:flex-row items-center lg:h-12 border-t border-lightgray lg:px-15">
            <div className='flex'>
                <p className='text-white lg:mr-6 text-sm leading-4 lg:leading-5 lg:text-base'>© 2025 “TOP GIFTS & EVENTS” S.R.L.</p>
                <Link href="/terms" className='text-white hidden lg:block'>Termeni & Condiții</Link>
            </div>
            <div className="flex items-center gap-2 group">
              <span className="text-white text-sm leading-4 lg:leading-5 lg:text-base">by Studio Modvis</span>
              <Image src="/icons/modvis.svg" alt="studio-modvis" className="transition duration-300 group-hover:rotate-[360deg]" width={10} height={10}/>
            </div>
        </div>
    </div>
  )
}

