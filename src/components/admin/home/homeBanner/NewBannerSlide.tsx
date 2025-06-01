import Image from 'next/image'
import React from 'react'
import { motion } from 'motion/react'
import { easeInOutCubic } from '@/lib/utils'
import { carousellDirection } from './HomeBannerContent'
import HomeBannerImageUpload from './HomeBannerImageUpload'

interface NewBannerSlideInterface {
    slide: number,
    nextSlide: number,
    index: number,
    direction: carousellDirection,
    selectedImage: string | null,
    onImageAdded: (imageBase64: string) => void
}

export default function NewBannerSlide({slide, nextSlide, index, direction, onImageAdded, selectedImage}: NewBannerSlideInterface) {

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
        {
            selectedImage ? 
            <Image unoptimized quality={100} priority src={selectedImage} alt="hero1" width={3584} height={1600} className='w-full h-full object-cover'/>
            :
            <HomeBannerImageUpload onImageAdded={onImageAdded}/>
        }
        
    </motion.div>
  )
}
