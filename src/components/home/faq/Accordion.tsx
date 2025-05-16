'use client'

import { motion } from 'motion/react'
import { Plus } from 'lucide-react';
import { COLORS } from '@/lib/colors/colors';
import { easeInOutCubic } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface AccordionProps {
    title: string,
    children: React.ReactNode,
    last?: boolean,
    open: boolean,
    productAccordion?: boolean
    setActiveIndex: () => void
}

export default function Accordion({title, children, last = false, open, setActiveIndex, productAccordion = false}: AccordionProps) {
    const textRef = useRef<HTMLParagraphElement>(null);
    const [textHeight, setTextHeight] = useState(0);

    // Update height on mount and resize
    useEffect(() => {
        
        const updateHeight = () => {
            if (textRef.current) {
                setTextHeight(textRef.current.clientHeight);
            }
        };
        
        // Initial height calculation
        updateHeight();
        
        // Update height on resize
        window.addEventListener('resize', updateHeight);
        
        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const accordionVariants = {
        close: {
            height: productAccordion ? "4rem" : textRef.current ? `calc(${textHeight}px + 2rem)` : '3.75rem'
        },
        open: {
            height: 'auto'
        }
    }

  return (
    <motion.div style={{height: textRef.current ? `calc(${textHeight}px + 2rem)` : 'auto'}} className={`overflow-hidden col-span-full lg:col-start-4 lg:col-span-9 ${last ? "border-y border-lightgray" : "border-t border-lightgray"}`} transition={{ease: easeInOutCubic, duration: .4}} variants={accordionVariants} animate={open ? "open" : "close"} initial={false}>
        <div style={{height: productAccordion ? "4rem" : textRef.current ? `calc(${textHeight}px + 2rem)` : 'auto'}} className='flex items-center justify-between cursor-pointer mb-2 gap-4' onClick={setActiveIndex}>
            <p ref={textRef} className='font-semibold font-manrope text-base lg:text-2xl'>{title}</p>
            <Plus color={COLORS.black} className={`min-w-5 min-h-5 max-h-5 max-w-5 w-fit transition duration-300 ${open ? "rotate-45" : ""}`} />
        </div>
        {
            textRef.current &&
            <div className='mb-4 w-8/9'>
                {children}
            </div>
        }
    </motion.div>
  )
}

