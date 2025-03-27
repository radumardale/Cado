'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Globe, Search, ShoppingBag } from 'lucide-react';
import { COLORS } from '@/lib/colors/colors';
import CatalogMenuButton from './CatalogMenu/CatalogMenuButton';
import TopHeader from './TopHeader';
import CatalogMenu from './CatalogMenu/CatalogMenu';
import { motion } from "motion/react"
import { easeInOutCubic } from '@/lib/utils';
import Breadcrums from '../Breadcrums';

export default function Header() {
    const [isCatalogButtonActive, setCatalogButtonActive] = useState(false);
    const [isCatalogMenuActive, setIsCatalogMenuActive] = useState(false);
    const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isCatalogButtonActive || isCatalogMenuActive) {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
            }

            setIsCatalogMenuOpen(true);
            return;
        }

        closeTimeoutRef.current = setTimeout(() => {
            setIsCatalogMenuOpen(false);
        }, 250);

    }, [isCatalogButtonActive, isCatalogMenuActive])

    const headerVariants = {
        close: {
            height: "5rem"
        },
        open: {
            height: "auto"
        }
    }

  return (
    <>
        <TopHeader />
        <div className='col-span-full -mr-16 -ml-16 sticky top-0 h-20 z-50'>
                <motion.div 
                    className='grid grid-cols-full gap-x-6 col-span-full bg-white overflow-hidden top-0 h-20' 
                    transition={{ ease: easeInOutCubic, duration: .4 }} 
                    variants={headerVariants}
                    animate={isCatalogMenuOpen ? "open" : "close"}>
                        <div className="grid grid-cols-full gap-x-6 col-span-full mx-16 relative">
                            <div className='absolute bottom-[.1rem] left-0 w-full h-[1px] bg-lightgray px-16'></div>
                            <div className='lg:col-start-2 lg:col-span-11 2xl:col-span-13 h-[5.1rem] flex justify-between items-center relative w-full'>
                                <Image src="/logo/logo-white.svg" width={228} height={56} alt='logo' className='h-14'/>
                                <div className='flex gap-8 items-center absolute left-1/2 -translate-x-1/2'>
                                    <CatalogMenuButton isCatalogMenuOpen={isCatalogMenuOpen} setCatalogButtonActive={setCatalogButtonActive} />
                                    <Link className='text-black font-semibold font-manrope' href="#">Despre Noi</Link>
                                    <Link className='text-black font-semibold font-manrope' href="#">Blog</Link>
                                    <Link className='text-black font-semibold font-manrope' href="#">FAQ</Link>
                                    <Link className='text-black font-semibold font-manrope' href="#">Contacte</Link>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <Link href="#">
                                        <Search color={COLORS.black} className='size-6' strokeWidth={1.25}/>
                                    </Link>
                                    <Link href="#">
                                        <Globe color={COLORS.black} className='size-6' strokeWidth={1.25}/>
                                    </Link> 
                                    <Link href="#">
                                        <ShoppingBag color={COLORS.black} className='size-6' strokeWidth={1.25}/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <CatalogMenu setIsCatalogMenuActive={setIsCatalogMenuActive}/>
                </motion.div>
        </div>
        <div className='mt-4 flex'>
            <Breadcrums />
        </div>
    </>
  )
}
