import Image from 'next/image'
import React from 'react'
import { motion } from 'motion/react'
import { easeInOutCubic } from '@/lib/utils'

interface ImageSlideInterface {
    src: string,
    slide: number,
    nextSlide: number,
    index: number
}

export default function ImageSlide({src, slide, nextSlide, index}: ImageSlideInterface) {

    const slideVariants = {
        initial: {
            clipPath: "inset(0px 0% 0px 0px)"
        },
        animate: {
            clipPath: "inset(0px 100% 0px 0px)"
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
