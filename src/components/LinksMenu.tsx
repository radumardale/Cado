'use client'

import { easeInOutCubic } from '@/lib/utils';
import { MessageCircle, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'

export default function LinksMenu() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const parentVariatns = {
        open: {
            transition: {
                staggerChildren: 0.15,
                staggerDirection: -1
            }
        }
    }

    const linkVariants = {
        close: {
            scale: 0.5,
            opacity: 0,
            y: 20
        },
        open: {
            scale: 1,
            opacity: 1,
            y: 0
        }
    }

  return (
    <motion.div 
        id='links-menu'
        initial={false}
        variants={parentVariatns}
        animate={isMenuOpen ? "open" : "close"}
        className='fixed right-8 bottom-8 z-20'>
        <motion.div 
            variants={linkVariants}
            transition={{ease: easeInOutCubic, duration: .3}}
            className={`${isMenuOpen ? "" : "pointer-events-none"} absolute left-0 -top-36`}
            >
                <Link href="#" className='size-14 flex items-center justify-center bg-blue-2 rounded-full mb-4 shadow-sm border border-white'>
                    <Image src="/icons/telegram.svg" alt="telegram logo" height={28} width={28} className='size-7 text-white'/>
                </Link>
        </motion.div>
        <motion.div 
            variants={linkVariants}
            transition={{ease: easeInOutCubic, duration: .3}}
            className={`${isMenuOpen ? "" : "pointer-events-none"} absolute left-0 -top-18`}
            >
                <Link href="#" className='size-14 flex items-center justify-center bg-blue-2 rounded-full mb-4 shadow-sm border border-white'>
                    <Image src="/icons/whatsapp.svg" alt="telegram logo" height={28} width={28} className='size-7 text-white'/>
                </Link>
        </motion.div>
        <div className='size-14 flex items-center justify-center bg-blue-2 rounded-full relative cursor-pointer group shadow-sm border border-white' onClick={() => {setMenuOpen(!isMenuOpen)}}>
            <MessageCircle className={`size-7 text-white transition-all duration-300 fill-transparent ${isMenuOpen ? "fill-white" : "group-hover:fill-white"}`} strokeWidth={1.5} />
            <Plus className={`absolute left-1/2 top-1/2 -translate-1/2 size-4 transition duration-300 ${isMenuOpen ? "rotate-45 text-blue-2" : "group-hover:text-blue-2 text-white"}`} strokeWidth={2} />
        </div>
    </motion.div>
  )
}
