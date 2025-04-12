'use client'

import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { easeInOutCubic } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { Pathnames } from '@/i18n/routing';

interface SeeMoreButtonInterface {
    className?: string,
    href?: Pathnames
}

export default function SeeMoreButton({className, href="/catalog"}: SeeMoreButtonInterface) {
    const [isButtonActive, setButtonActive] = useState(false);

    const buttonVariants = {
        close: {
            width: '3rem'
        },
        open: {
            width: "auto"
        }
    }

    const textVariants = {
        close: {
            opacity: 0
        },
        open: {
            opacity: 1
        }
    }

  return (
    <Link href={href} className={`col-span-full flex justify-center ${className}`}>
        <motion.button 
            initial={false}
            variants={buttonVariants} 
            transition={{ease: easeInOutCubic, duration: .4, delay: 0.1}}
            animate={isButtonActive ? "open" : "close"} 
            className='cursor-pointer bg-blue-2 rounded-3xl h-12 text-white font-manrope font-semibold flex items-center gap-2 relative'
            onMouseEnter={() => {setButtonActive(true)}} 
            onMouseLeave={() => {setButtonActive(false)}}
        >
            <motion.span 
                initial={false}
                className='whitespace-nowrap ml-6 mr-12'
                transition={{ease: easeInOutCubic, duration: .4, delay: 0.1}}
                variants={textVariants}
                animate={isButtonActive ? "open" : "close"} 
            >
                Vezi mai multe
            </motion.span>
            <ArrowRight className={`size-6 absolute z-20 right-3 top-1/2 -translate-y-1/2 transition duration-300 ${isButtonActive ? "" : "-rotate-45 delay-300"}`}/>
        </motion.button>
    </Link>
  )
}
