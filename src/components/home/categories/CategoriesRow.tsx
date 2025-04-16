'use client'

import React, { useState } from 'react'
import CategoriesCard from './CategoriesCard'
import { Categories } from '@/lib/enums/Categories'

interface CategoriesRowInterface {
    index: number,
    index_2:number,
    title?: string,
    categories: Categories[],
    images: string[]
}

export enum CategoriesRowHover {
    LEFT,
    RIGHT,
    NONE
}

export default function CategoriesRow({index, index_2, categories, images}: CategoriesRowInterface) {
    const [rowHover , setRowHover] = useState(CategoriesRowHover.NONE)

  return (
    <div className='col-span-full flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-0'>
        <CategoriesCard category={categories[0]} index={index} rowHover={rowHover} setRowHover={setRowHover} side={CategoriesRowHover.LEFT} image={images[0]}/>
        <div className='1/13 mx-1'></div>
        <CategoriesCard category={categories[1]} index={index_2} rowHover={rowHover} setRowHover={setRowHover} side={CategoriesRowHover.RIGHT} image={images[1]}/>
    </div>
  )
}
