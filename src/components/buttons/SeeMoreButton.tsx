'use client'

import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from '@/i18n/navigation';
import { Pathnames } from '@/i18n/routing';

interface SeeMoreButtonInterface {
    className?: string,
    href?: Pathnames,
    text?: string
}

export default function SeeMoreButton({className, href="/catalog", text="Vezi mai multe"}: SeeMoreButtonInterface) {
    const [isButtonActive, setButtonActive] = useState(false);

  return (
    <div className='flex justify-center'>
        <Link href={href} className={`col-span-full w-fit ${className}`}>
            <button 
                className='cursor-pointer bg-blue-2 rounded-3xl h-12 text-white font-manrope font-semibold flex items-center gap-2 relative lg:w-12 lg:hover:w-[11.4rem] transition-all duration-400 group overflow-hidden'
                onMouseEnter={() => {setButtonActive(true)}} 
                onMouseLeave={() => {setButtonActive(false)}}
            >
                <span 
                    className='whitespace-nowrap ml-6 mr-12 lg:group-hover:opacity-100 transition duration-400 lg:opacity-0'
                >
                    {text}
                </span>
                <ArrowRight className={`size-6 absolute z-20 right-3 top-1/2 -translate-y-1/2 transition duration-300 -rotate-45 ${isButtonActive ? "lg:rotate-0" : "lg:-rotate-45 lg:delay-200"}`}/>
            </button>
        </Link>
    </div>
  )
}
