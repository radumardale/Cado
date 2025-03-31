import Image from 'next/image'
import React from 'react'
import { motion } from 'motion/react'
import { easeInOutCubic } from '@/lib/utils'
import { carousellDirection } from './Hero'

interface ImageSlideInterface {
    src: string,
    slide: number,
    nextSlide: number,
    index: number,
    direction: carousellDirection
}

export default function ImageSlide({src, slide, nextSlide, index, direction}: ImageSlideInterface) {

    const slideVariants = {
        initial: {
            clipPath: direction === carousellDirection.FORWARD ? "inset(0px 0% 0px 0px)" : "inset(0px 0% 0px 0%)",
            transition: {
                duration: 0
            }
        },
        animate: {
            clipPath: direction === carousellDirection.FORWARD  ? "inset(0px 100% 0px 0px)" : "inset(0px 0px 0px 100%)"
        },
      }

  return (
    <motion.div 
        variants={slideVariants} 
        transition={{ease: easeInOutCubic, duration: .8}} 
        initial={false} 
        animate={slide === index ? "animate" : "initial"}
        style={{zIndex: slide === index ? 4 : nextSlide === index ? 3 : 0}}
        className='absolute left-0 top-0 w-full h-full'
    >
        <Image src={src} alt="hero1" width={1792} height={800} className='w-full h-full object-cover'/>
    </motion.div>
  )
}
