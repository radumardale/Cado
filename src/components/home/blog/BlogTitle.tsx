import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'

interface BlogTitleProps {
    goToNextSlide: () => void;
    goToPreviousSlide: () => void;
}

export default function BlogTitle({goToNextSlide, goToPreviousSlide}: BlogTitleProps) {
  return (
    <>
        <h3 className='col-span-6 lg:col-span-7 font-manrope text-2xl lg:text-[2rem] leading-7 lg:leading-11 uppercase font-semibold'>ULTIMELE NOUTĂȚI</h3>
        <div className='col-start-7 col-span-2 lg:col-span-1 lg:col-start-15 flex justify-end items-center gap-2 lg:gap-4'>
            <button className='cursor-pointer' onClick={goToPreviousSlide}>
                <ArrowLeft className='size-6 lg:size-8' />
            </button>
            <button className='cursor-pointer' onClick={goToNextSlide}>
                <ArrowRight className='size-6 lg:size-8'/>
            </button>
        </div>
    </>
  )
}
