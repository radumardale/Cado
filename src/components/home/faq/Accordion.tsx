'use client'

import { motion } from 'motion/react'
import { Plus } from 'lucide-react';
import { COLORS } from '@/lib/colors/colors';
import { easeInOutCubic } from '@/lib/utils';

interface AccordionProps {
    title: string,
    children: React.ReactNode,
    last?: boolean,
    open: boolean,
    setActiveIndex: () => void
}

export default function Accordion({title, children, last = false, open, setActiveIndex}: AccordionProps) {

    const accordionVariants = {
        close: {
            height: '3.75rem'
        },
        open: {
            height: 'auto'
        }
    }

  return (
    <motion.div className={`h-15 overflow-hidden col-start-4 col-span-9 ${last ? "border-y border-lightgray" : "border-t border-lightgray"}`} transition={{ease: easeInOutCubic, duration: .4}} variants={accordionVariants} animate={open ? "open" : "close"} initial={false}>
        <div className='h-15 flex items-center justify-between cursor-pointer mb-2' onClick={setActiveIndex}>
            <p className='font-semibold font-manrope text-2xl'>{title}</p>
            <Plus color={COLORS.black} className={`size-5 transition duration-300 ${open ? "rotate-45" : ""}`} />
        </div>
        <div className='mb-4 w-8/9'>
            {children}
        </div>
    </motion.div>
  )
}

