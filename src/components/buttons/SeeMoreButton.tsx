'use client'

import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { easeInOutCubic } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { Pathnames } from '@/i18n/routing';

interface SeeMoreButtonInterface {
    className?: string,
    href?: Pathnames,
    text?: string
}

export default function SeeMoreButton({className, href="/catalog", text="Vezi mai multe"}: SeeMoreButtonInterface) {
    const [isButtonActive, setButtonActive] = useState(false);
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

    const buttonVariants = {
        close: {
            width: isMounted && isDesktop ? "3rem" : 'auto'
        },
        open: {
            width: "auto"
        }
    }

    const textVariants = {
        close: {
            opacity: isMounted && isDesktop ? 0 : 1
        },
        open: {
            opacity: 1
        }
    }

  return (
    <Link href={href} className={`col-span-full flex justify-center ${className}`}>
        <motion.button 
            initial="close"
            variants={buttonVariants} 
            transition={{ease: easeInOutCubic, duration: .4, delay: 0.1}}
            animate={isButtonActive ? "open" : "close"} 
            className='cursor-pointer bg-blue-2 rounded-3xl h-12 text-white font-manrope font-semibold flex items-center gap-2 relative'
            onMouseEnter={() => {setButtonActive(true)}} 
            onMouseLeave={() => {setButtonActive(false)}}
        >
            <motion.span 
                initial="close"
                className='whitespace-nowrap ml-6 mr-12'
                transition={{ease: easeInOutCubic, duration: .4, delay: 0.1}}
                variants={textVariants}
                animate={isButtonActive ? "open" : "close"} 
            >
                {text}
            </motion.span>
            <ArrowRight className={`size-6 absolute z-20 right-3 top-1/2 -translate-y-1/2 transition duration-300 ${isButtonActive ? "" : "lg:-rotate-45 lg:delay-300"}`}/>
        </motion.button>
    </Link>
  )
}
