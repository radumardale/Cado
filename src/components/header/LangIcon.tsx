'use client'

import { Globe } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { AnimatePresence } from 'motion/react';
import LangSidebar from './LangSidebar';

export default function LangIcon() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const lenis = useLenis();

    useEffect(() => {
        if (isSidebarOpen) {
            lenis?.stop();
            window.document.body.classList.add('carousel')
        } else {
            lenis?.start();
            window.document.body.classList.remove('carousel')
        }
    }, [isSidebarOpen])

    return (
        <>
            <AnimatePresence>
                {isSidebarOpen && <LangSidebar setSidebarOpen={setSidebarOpen}/>}
            </AnimatePresence>
            <button className='relative cursor-pointer' onClick={() => {setSidebarOpen(true)}}>
                <Globe className='size-6' strokeWidth={1.25}/>
            </button>
        </>
    )
}