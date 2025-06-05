'use client'

import { useState, useEffect } from 'react'
import LinksMenu from '../LinksMenu'
import { ArrowUp } from 'lucide-react'
import { useLenis } from 'lenis/react'

export default function LinkMenuWrapper() {
    const [isScrolled, setIsScrolled] = useState(false)
    const lenis = useLenis();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 200)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div>
            {
                !isScrolled ? <LinksMenu /> : 
                <div onClick={() => {lenis?.scrollTo(0)}} className='cursor-pointer fixed right-8 bottom-8 z-20 size-16 3xl:size-14 flex items-center justify-center bg-blue-2 rounded-full shadow-sm border border-white'>
                    <ArrowUp strokeWidth={1.5} className='text-white' />
                </div> 
            }
        </div>
    )
}