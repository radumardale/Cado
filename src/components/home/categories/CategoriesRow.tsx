'use client'

import React, { useState } from 'react'
import CategoriesCard from './CategoriesCard'

interface CategoriesRowInterface {
    index: number,
    title: string[],
    description: string[],
    images: string[]
}

export enum CategoriesRowHover {
    LEFT,
    RIGHT,
    NONE
}

export default function CategoriesRow({index, title, description, images}: CategoriesRowInterface) {
    const [rowHover , setRowHover] = useState(CategoriesRowHover.NONE)

  return (
    <div className='col-span-full flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-0'>
        <CategoriesCard description={description[0]} index={index} title={title[0]} rowHover={rowHover} setRowHover={setRowHover} side={CategoriesRowHover.LEFT} image={images[0]}/>
        <div className='1/13 mx-1'></div>
        <CategoriesCard description={description[1]} index={index + 1} title={title[1]} rowHover={rowHover} setRowHover={setRowHover} side={CategoriesRowHover.RIGHT} image={images[1]}/>
    </div>
  )
}
