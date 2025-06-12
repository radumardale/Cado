import { ArrowRight } from 'lucide-react'
import React from 'react'
import { CategoriesRowHover } from './CategoriesRow'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Categories } from '@/lib/enums/Categories'
import { Ocasions } from '@/lib/enums/Ocasions'

interface CategoriesCardInterface {
    index: number,
    category: Categories | Ocasions,
    ocasion?: boolean,
    ocastionTitle?: string,
    side: CategoriesRowHover,
    rowHover: CategoriesRowHover,
    setRowHover: (v: CategoriesRowHover) => void,
    image: string;
    title?: string;
}

export default function CategoriesCard({index, category, side, rowHover, setRowHover, image, ocasion = false, title}: CategoriesCardInterface) {
    const namespace = ocasion ? "ocasions" : "Tags";
    const query = ocasion ? {ocasions: category} : {category: category};
    const t = useTranslations(namespace);

    console.log(ocasion ? category : "")

  return (
    <Link href={{pathname: '/catalog', query: query}} className={`bg-blue-2 h-38 lg:h-80 rounded-2xl relative transition-all duration-400 cursor-pointer overflow-hidden ${side === rowHover ? "lg:w-7/13" : rowHover === CategoriesRowHover.NONE ? "lg:w-6/13" : "lg:w-5/13"}`} onMouseEnter={() => {setRowHover(side)}} onMouseLeave={() => {setRowHover(CategoriesRowHover.NONE)}}>
        {image.length > 0 && 
            <>
                <Image unoptimized src={image} alt={t(`${category}.title`)} className='absolute left-0 top-0 w-full h-full object-cover' width={702} height={320} />
                <div className='absolute left-0 top-0 w-full h-full opacity-60' style={{backgroundColor: `var(--blue${index + 1})`}}></div>
                <div className='absolute left-0 top-0 w-full h-full bg-linear-to-r from-pureblack opacity-40'></div>
            </>
        }
        <p className='text-white font-manrope font-semibold text-2xl lg:text-3xl leading-7 lg:leading-11 uppercase absolute left-4 lg:left-8 top-4 lg:top-8'>{ocasion ? title : t(`${category}.title`)}</p>
        <p className='text-white absolute left-4 lg:left-8 bottom-4 lg:bottom-8 w-80 lg:w-104 text-sm lg:text-base leading-4 lg:leading-5'>{t(`${category}.description`)}</p>
        <button className={`absolute right-4 lg:right-8 top-4 lg:top-6 size-8 lg:size-12 flex justify-center items-center bg-white rounded-full transition duration-400 ${side === rowHover ? "-rotate-45 lg:rotate-0" : "-rotate-45 lg:-rotate-45"}`}>
            <ArrowRight style={{color: `var(--blue${index + 1})`}} className='size-5 lg:size-8'/>
        </button>
    </Link>
  )
}
