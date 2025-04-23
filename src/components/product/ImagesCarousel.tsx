import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import { easeInOutCubic } from '@/lib/utils';
import { ProductInterface } from '@/models/product/types/productInterface';

interface ImagesCarouselInterface {
    setCarouselOpen: (v: boolean) => void,
    product: ProductInterface,
    locale: string,
    initialActive?: number
}

export default function ImagesCarousel({setCarouselOpen, product, locale, initialActive = 0}: ImagesCarouselInterface) {
    const [activeImage, setActiveImage] = useState(initialActive);
    const [nextImage, setNextImage] = useState((initialActive + 1) % product.images.length);
    const [prevImage, setPrevImage] = useState(initialActive - 1 < 0 ? product.images.length - 1 : initialActive - 1);
    const [isDragOver, setDragOver] = useState(true);

    // Motion values for drag and opacity
    const x = useMotionValue(0);

    const prevDragOpacity = useTransform(
        x, 
        [0, 10], 
        [0, 1]
    );


    const nextDragOpacity = useTransform(
        x, 
        [-10, 0], 
        [1, 0]
    );

    const activeDragOpacity = useTransform(
        x, 
        [-10, 0, 10], 
        [0, 1, 0]
    );
    
    // Update prev/next indexes when active changes
    useEffect(() => {
        setDragOver(false)
        setTimeout(() => {
            setDragOver(true);
            setNextImage((activeImage + 1) % product.images.length);
            setPrevImage(activeImage - 1 < 0 ? product.images.length - 1 : activeImage - 1);
        }, 300)
    }, [activeImage, product.images.length]);
    
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 150;
        
        if (info.offset.x > threshold) {
            setActiveImage(prevImage);
        } else if (info.offset.x < -threshold) {
            setActiveImage(nextImage);
        }

        // Reset the drag position
        x.set(0);
    };
    
    const nextSlide = () => {
        setActiveImage(nextImage);
    };
    
    const prevSlide = () => {
        setActiveImage(prevImage);
    };

    return (
        <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1, transition: {duration: .2, ease: easeInOutCubic}}}
            exit={{opacity: 0, transition: {duration: .2, ease: easeInOutCubic}}}
            className='fixed bg-darkblue/75 w-screen h-full top-0 left-0 z-50 backdrop-blur-xs flex flex-col items-center py-4 lg:py-6 px-4 justify-end lg:justify-start' 
            onMouseDown={(e) => {e.stopPropagation(); setCarouselOpen(false)}}
        >
            <motion.div 
                 className='lg:flex-1 h-full lg:h-auto absolute top-0 lg:relative mb-4 w-[calc(100%-2rem)] lg:w-[calc(100%-12rem)] max-w-full cursor-grab box-border' 
                 onMouseDown={(e) => {e.stopPropagation()}}
                 drag={isDragOver ? "x" : false}
                 dragConstraints={{ left: 0, right: 0 }}
                 dragElastic={0.05} // Reduced from 0.2 to make it less elastic
                 dragMomentum={false} // Disable momentum for more control
                 dragTransition={{ 
                     bounceStiffness: 600, // Higher stiffness means less bounce
                     bounceDamping: 30 // Higher damping means faster settle
                 }}
                 onDragEnd={handleDragEnd}
                 style={{ x }}
            >
                
                {product.images.map((image, index) => (
                    <motion.div
                        key={index} 
                        className='pointer-events-none top-1/2 lg:top-0 -translate-y-1/2 lg:-translate-y-0 lg:h-full w-full lg:w-auto rounded-2xl absolute left-1/2 -translate-x-1/2'
                        style={{ opacity: index === activeImage ? isDragOver ? activeDragOpacity : 1 : index === nextImage ? isDragOver ? nextDragOpacity : 0 : index === prevImage ? isDragOver ? prevDragOpacity : 0 : 0 }}
                    >
                        <Image    
                            src={image} 
                            alt={product.title[locale]} 
                            width={738} 
                            height={919} 
                            className={`h-auto lg:h-full w-auto rounded-2xl lg:max-w-none object-contain ${activeImage === index ? "z-10" : "z-0"}`} 
                        />
                    </motion.div>
                ))}
                
            </motion.div>

            <div className="flex gap-4 justify-center" onMouseDown={(e) => {e.stopPropagation()}}>
                {product.images.map((image, index) => (
                    <button 
                        disabled={!isDragOver}
                        key={index} 
                        onClick={() => {setActiveImage(index)}} 
                        className={`cursor-pointer relative after:content-[''] after:absolute after:w-full after:h-full after:rounded-lg after:bg-black after:top-0 after:left-0 after:transition after:duration-300 ${activeImage === index ? "after:opacity-0" : "after:opacity-50"}`}
                    >
                        <Image 
                            src={image} 
                            alt={product.title[locale]} 
                            width={97} 
                            height={97} 
                            className='rounded-lg size-24 object-cover' 
                        />
                    </button>
                ))}
            </div>
            
            <button 
                className='hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 cursor-pointer' 
                onMouseDown={(e) => {e.stopPropagation()}} 
                onClick={nextSlide}
            >
                <ArrowRight className='text-white size-8' strokeWidth={1.5} />
            </button>
            
            <button 
                className='hidden lg:block absolute left-16 top-1/2 -translate-y-1/2 cursor-pointer' 
                onMouseDown={(e) => {e.stopPropagation()}} 
                onClick={prevSlide}
            >
                <ArrowLeft className='text-white size-8' strokeWidth={1.5} />
            </button>
            
            <button 
                className='absolute right-4 lg:right-16 top-4 lg:top-6 cursor-pointer'
                onClick={() => setCarouselOpen(false)}
            >
                <X className='text-white size-6 lg:size-8' strokeWidth={1.5} />
            </button>
        </motion.div>
    )
}