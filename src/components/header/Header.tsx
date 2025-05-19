'use client'

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { COLORS } from '@/lib/colors/colors';
import CatalogMenuButton from './CatalogMenu/CatalogMenuButton';
import TopHeader from './TopHeader';
import CatalogMenu from './CatalogMenu/CatalogMenu';
import { motion } from "motion/react";
import { easeInOutCubic } from '@/lib/utils';
import Breadcrums from '../Breadcrums';
import CustomLink from '../CustomLink';
import { Link } from '@/i18n/navigation';
import { Categories } from '@/lib/enums/Categories';
import CartIcon from './CartIcon';
import MobileMenuIcon from './MobileMenuIcon';
import LangIcon from './LangIcon';

interface HeaderProps {
    category?: Categories | null,
    productInfo?: {
        title: string,
        id: string
    }
    breadcrumbs?: boolean
}

export default function Header({category, breadcrumbs = false, productInfo}: HeaderProps) {
    const [isCatalogButtonActive, setCatalogButtonActive] = useState(false);
    const [isCatalogMenuActive, setIsCatalogMenuActive] = useState(false);
    const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isMounted, setMounted] = useState(false);
  
    // Check screen size on mount and window resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        
        // Set initial state
        checkScreenSize();

        setMounted(true);
        
        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);
        
        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

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
            height: isMounted && isDesktop ? "5rem" : "auto"
        },
        open: {
            height: "auto"
        }
    }

  return (
    <>
        <TopHeader />
        <div className='col-span-full px-4 lg:px-0 -ml-4 -mr-4 bg-white lg:-mr-16 lg:-ml-16 sticky top-0 h-14 lg:h-20 z-50'>
                <motion.div 
                    className='grid grid-cols-full gap-x-2 lg:gap-x-6 col-span-full bg-white lg:overflow-hidden top-0 h-14 lg:h-20' 
                    transition={{ ease: easeInOutCubic, duration: .55 }} 
                    variants={headerVariants}
                    animate={isCatalogMenuOpen ? "open" : "close"}>
                        <div className="grid grid-cols-full gap-x-6 col-span-full lg:mx-16 relative">
                            <div className='absolute bottom-[.1rem] left-0 w-full h-[1px] bg-lightgray px-16 lg:block hidden'></div>
                            <div className='lg:col-start-2 2xl:col-start-2 col-span-8 lg:col-span-11 2xl:col-span-13 h-14 lg:h-[5.1rem] flex justify-between items-center relative w-full border-b border-lightgray lg:border-none'>
                                <div className="flex gap-4 items-center lg:hidden">
                                    <MobileMenuIcon isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>
                                    <LangIcon />
                                </div>
                                <Link href="/" className='max-w-[14vw]'>
                                    <Image unoptimized src="/logo/logo-white.svg" width={228} height={56} alt='logo' className='h-8 lg:h-14 w-fit'/>
                                </Link>
                                <div className='hidden gap-8 items-center absolute left-1/2 -translate-x-1/2 lg:flex'>
                                    <CatalogMenuButton isCatalogMenuOpen={isCatalogMenuOpen} setCatalogButtonActive={setCatalogButtonActive} />
                                    <CustomLink className='text-black font-semibold font-manrope h-5' href="/" value='Acasă'/>
                                    <CustomLink className='text-black font-semibold font-manrope h-5' href="/about-us" value='Despre Noi'/>
                                    <CustomLink className='text-black font-semibold font-manrope h-5' href="/blogs" value='Blog'/>
                                    <CustomLink className='text-black font-semibold font-manrope h-5' href="/contacts" value='Contacte'/>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <button className='cursor-pointer h-6' onClick={() => {if (isDesktop) setIsCatalogMenuOpen(true); else setSidebarOpen(true);}}>
                                        <Search color={COLORS.black} className='size-6' strokeWidth={1.25}/>
                                    </button>
                                    <div className='hidden lg:block h-6'>
                                        <LangIcon />
                                    </div>
                                    <CartIcon />
                                </div>
                            </div>
                        </div>
                        {
                            isMounted && isDesktop && <CatalogMenu setIsCatalogMenuActive={setIsCatalogMenuActive}/>
                        }
                </motion.div>
        </div>
        {
            breadcrumbs && <Breadcrums category={category} productInfo={productInfo}/>
        }
    </>
  )
}
