import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'

interface BlogTitleProps {
    goToNextSlide: () => void;
    goToPreviousSlide: () => void;
}

export default function BlogTitle({goToNextSlide, goToPreviousSlide}: BlogTitleProps) {
  return (
    <>
        <h3 className='col-span-7 font-manrope text-[2rem] leading-11 uppercase font-semibold'>ULTIMELE NOUTĂȚI</h3>
        <div className='col-start-15 flex justify-end items-center gap-4'>
            <button className='cursor-pointer' onClick={goToPreviousSlide}>
                <ArrowLeft className='size-8' />
            </button>
            <button className='cursor-pointer' onClick={goToNextSlide}>
                <ArrowRight className='size-8'/>
            </button>
        </div>
    </>
  )
}
