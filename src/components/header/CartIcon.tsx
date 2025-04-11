'use client'

import { CartInterface } from '@/lib/types/CartInterface';
import { ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts'
import CartSidebar from './CartSidebar';
import { useLenis } from 'lenis/react';
import { AnimatePresence } from 'motion/react';
import { useLocale } from 'next-intl';

export default function CartIcon() {
    const [value, setValue] = useLocalStorage<CartInterface[]>('cart', []);
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const lenis = useLenis();
    const locale = useLocale();

    useEffect(() => {
        if (isSidebarOpen) {
            lenis?.stop();
            window.document.body.classList.add('carousel')
        } else {
            lenis?.start();
            window.document.body.classList.remove('carousel')
        }
    }, [isSidebarOpen])

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <AnimatePresence>
                {isSidebarOpen && <CartSidebar items={value} locale={locale} setSidebarOpen={setSidebarOpen} setValue={setValue}/>}
            </AnimatePresence>
            <button className='relative cursor-pointer' onClick={() => {setSidebarOpen(true)}}>
                {mounted && value.length > 0 && (
                    <div className='absolute rounded-full size-5 bg-black -right-2 -top-2 text-white text-xs flex items-center justify-center leading-0'>
                        {value.length}
                    </div>
                )}
                <ShoppingBag className='size-6' strokeWidth={1.25}/>
            </button>
        </>
    )
}