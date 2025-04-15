import { TermsSectionsArr } from '@/lib/enums/TermsSections'
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl'
import React from 'react'

interface TermsSidebarProps {
    activeSection: number;
    setActiveSection: (section: number) => void;
}

export default function TermsSidebar({activeSection, setActiveSection}: TermsSidebarProps) {
    const t = useTranslations("terms_sections");
  return (
    <div className='col-span-3 mt-16 hidden lg:block'>
        {
            TermsSectionsArr.map((section, index) => {
                return (
                    <button key={index} className='py-3 flex justify-between items-center first:border-t border-b border-lightgray w-full cursor-pointer' onClick={() => {setActiveSection(index)}}>
                        <span className='font-manrope font-semibold'>{t(section)}</span>
                        <div className={`size-8 border border-black rounded-full flex items-center justify-center transition duration-300 ${index === activeSection ? "" : "bg-black text-white -rotate-45"}`}>
                            <ArrowRight className='size-5' />
                        </div>
                    </button>
                )
            })
        }
    </div>
  )
}