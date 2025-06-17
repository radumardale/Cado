'use client'

import React, { useState } from 'react'
import CategoriesCard from './CategoriesCard'
import { Categories } from '@/lib/enums/Categories'
import { Ocasions } from '@/lib/enums/Ocasions'

interface CategoriesRowInterface {
    index: number,
    index_2:number,
    title?: string,
    ocasion: Ocasions,
    category: Categories,
    images: string[],
    sortByDiscount?: boolean
}

export enum CategoriesRowHover {
    LEFT,
    RIGHT,
    NONE
}

export default function CustomRow({index, index_2, category, ocasion, images, title, sortByDiscount}: CategoriesRowInterface) {
    const [rowHover , setRowHover] = useState(CategoriesRowHover.NONE)

  return (
    <div className='col-span-full flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-0'>
        <CategoriesCard sortByDiscount={sortByDiscount} title={title} ocasion category={ocasion} index={index} rowHover={rowHover} setRowHover={setRowHover} side={CategoriesRowHover.LEFT} image={images[0]}/>
        <div className='1/13 mx-1'></div>
        <CategoriesCard category={category} index={index_2} rowHover={rowHover} setRowHover={setRowHover} side={CategoriesRowHover.RIGHT} image={images[1]}/>
    </div>
  )
}
