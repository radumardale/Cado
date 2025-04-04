import { ArrowRight } from 'lucide-react'
import React from 'react'
import { CategoriesRowHover } from './CategoriesRow'
import Image from 'next/image'

interface CategoriesCardInterface {
    index: number,
    title: string,
    description: string,
    side: CategoriesRowHover,
    rowHover: CategoriesRowHover,
    setRowHover: (v: CategoriesRowHover) => void,
    image: string
}

export default function CategoriesCard({index, title, description, side, rowHover, setRowHover, image}: CategoriesCardInterface) {
  return (
    <div className={`bg-blue-2 h-80 rounded-2xl relative transition-all duration-400 cursor-pointer overflow-hidden ${side === rowHover ? "w-7/13" : rowHover === CategoriesRowHover.NONE ? "w-6/13" : "w-5/13"}`} onMouseEnter={() => {setRowHover(side)}} onMouseLeave={() => {setRowHover(CategoriesRowHover.NONE)}}>
        {image.length > 0 && 
            <>
                <Image src={image} alt={title} className='absolute left-0 top-0 w-full h-full object-cover' width={702} height={320} />
                <div className='absolute left-0 top-0 w-full h-full opacity-60' style={{backgroundColor: `var(--blue${index + 1})`}}></div>
                <div className='absolute left-0 top-0 w-full h-full bg-linear-to-r from-pureblack opacity-40'></div>
            </>
        }
        <p className='text-white font-manrope font-semibold text-3xl leading-11 uppercase absolute left-8 top-8'>{title}</p>
        <p className='text-white absolute left-8 bottom-8 w-104'>{description}</p>
        <button className={`absolute right-8 top-6 size-12 flex justify-center items-center bg-white rounded-full transition duration-400 ${side === rowHover ? "rotate-0" : "-rotate-45"}`}>
            <ArrowRight style={{color: `var(--blue${index + 1})`}} />
        </button>
    </div>
  )
}
