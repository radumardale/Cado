'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react';
import { COLORS } from '@/lib/colors/colors';
import { easeInOutCubic } from '@/lib/utils';

interface AccordionProps {
    title: string,
    children: React.ReactNode,
    last?: boolean
}

export default function Accordion({title, children, last = false}: AccordionProps) {
    const [isAccordionOpen, setAccordionOpen] = useState(true);

    const accordionVariants = {
        close: {
            height: '3rem'
        },
        open: {
            height: 'auto'
        }
    }

  return (
    <motion.div className={`h-12 overflow-hidden ${last ? "" : "border-b border-lightgray"}`} transition={{ease: easeInOutCubic, duration: .4}} variants={accordionVariants} animate={isAccordionOpen ? "open" : "close"} initial={false}>
        <div className='h-12 flex items-center justify-between cursor-pointer mb-4' onClick={() => {setAccordionOpen(!isAccordionOpen)}}>
            <p className='font-semibold font-manrope'>{title}</p>
            <Plus color={COLORS.black} className={`size-5 transition duration-300 ${isAccordionOpen ? "rotate-45" : ""}`} />
        </div>
        <div className='mb-4'>
            {children}
        </div>
    </motion.div>
  )
}
