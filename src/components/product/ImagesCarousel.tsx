import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Image from 'next/image'
import React, { useState, useEffect, KeyboardEvent, useCallback } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import { easeInOutCubic } from '@/lib/utils';
import { ProductInterface } from '@/models/product/types/productInterface';

interface ImagesCarouselInterface {
    setCarouselOpen: (v: boolean) => void,
    product: ProductInterface,
    locale: string,
    initialActive?: number
}

type KeyboardEventHandler = (event: globalThis.KeyboardEvent) => void;

export default function ImagesCarousel({setCarouselOpen, product, locale, initialActive = 0}: ImagesCarouselInterface) {
    const [activeImage, setActiveImage] = useState(initialActive);
    const [nextImage, setNextImage] = useState((initialActive + 1) % product.images.length);
    const [prevImage, setPrevImage] = useState(initialActive - 1 < 0 ? product.images.length - 1 : initialActive - 1);
    const [isDragOver, setDragOver] = useState(true);
    const [isDrag, setIsDrag] = useState(false);

    const hasMultipleImages = product.images.length > 1;

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
    
    // Navigation functions
    const nextSlide = useCallback(() => {
        // For 2 images, next is always the other image
        if (product.images.length === 2) {
            setActiveImage(activeImage === 0 ? 1 : 0);
        } else {
            setActiveImage(nextImage);
        }
    }, [activeImage, nextImage, product.images.length]);
    
    const prevSlide = useCallback(() => {
        // For 2 images, prev is always the other image
        if (product.images.length === 2) {
            setActiveImage(activeImage === 0 ? 1 : 0);
        } else {
            setActiveImage(prevImage);
        }
    }, [activeImage, prevImage, product.images.length]);

    const closeCarousel = useCallback(() => {
        if (isDrag) return;
        setCarouselOpen(false);
    }, [setCarouselOpen]);
    
    // Update prev/next indexes when active changes
    useEffect(() => {
        if (!hasMultipleImages) return;
        
        setDragOver(false);
        setTimeout(() => {
            setDragOver(true);
            
            // For 2 images, next is always the other image
            if (product.images.length === 2) {
                setNextImage(activeImage === 0 ? 1 : 0);
                setPrevImage(activeImage === 0 ? 1 : 0);
            } else {
                // For 3+ images, use modular arithmetic
                setNextImage((activeImage + 1) % product.images.length);
                setPrevImage(activeImage - 1 < 0 ? product.images.length - 1 : activeImage - 1);
            }
        }, 300);
    }, [activeImage, product.images.length, hasMultipleImages]);

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        if (!hasMultipleImages) return; // Don't handle drag for single image
        
        const threshold = 150;
        
        if (info.offset.x > threshold) {
            // For 2 images, when dragging right, always go to the other image
            if (product.images.length === 2) {
                setActiveImage(activeImage === 0 ? 1 : 0);
            } else {
                setActiveImage(prevImage);
            }
        } else if (info.offset.x < -threshold) {
            // For 2 images, when dragging left, always go to the other image
            if (product.images.length === 2) {
                setActiveImage(activeImage === 0 ? 1 : 0);
            } else {
                setActiveImage(nextImage);
            }
        }
        
        setTimeout(() => {
            setIsDrag(false);
        }, 50);
        
        // Reset the drag position
        x.set(0);
    };
    
    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown: KeyboardEventHandler = (event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextSlide();
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                prevSlide();
            } else if (event.key === 'Escape') {
                closeCarousel();
            }
        };

        // Add the event listener
        window.addEventListener('keydown', handleKeyDown);
        
        // Focus the container div to ensure it receives keyboard events
        document.body.setAttribute('tabindex', '-1');
        document.body.focus();
        
        // Remove the event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.removeAttribute('tabindex');
        };
    }, [nextSlide, prevSlide, closeCarousel]);

    return (
        <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1, transition: {duration: .2, ease: easeInOutCubic}}}
            exit={{opacity: 0, transition: {duration: .2, ease: easeInOutCubic}}}
            className='fixed bg-darkblue/75 w-screen h-full top-0 left-0 z-50 backdrop-blur-xs flex flex-col items-center py-4 lg:py-6 px-4 justify-end lg:justify-start' 
            onMouseDown={(e) => {e.stopPropagation(); closeCarousel()}}
            role="dialog"
            aria-modal="true"
            aria-label="Image carousel"
        >
            <div className="lg:hidden absolute top-4 left-4 z-10 bg-black/75 text-white px-6 py-2 rounded-3xl font-manrope font-semibold">
                {(activeImage || 0) + 1} / {product.images.length}
            </div>
            
            <motion.div 
                 className='flex-1 relative top-0 lg:relative mb-4 w-full lg:w-[calc(100%-10rem)] max-w-full cursor-grab box-border'
                 onMouseDown={(e) => {e.stopPropagation()}}
                 drag={isDragOver && hasMultipleImages ? "x" : false}
                 dragConstraints={{ left: 0, right: 0 }}
                 dragElastic={0.05}
                 dragMomentum={false}
                 dragTransition={{
                     bounceStiffness: 600,
                     bounceDamping: 30
                 }}
                 onDragEnd={handleDragEnd}
                 onDragStart={() => {
                    setIsDrag(true);
                }}
                 style={{ x }}
            >
                {product.images.map((image, index) => (
                    <motion.div
                        key={index}
                        className='pointer-events-none w-full rounded-lg lg:rounded-2xl absolute h-full flex justify-center items-center'
                        style={{
                            opacity: index === activeImage 
                                ? isDragOver 
                                    ? activeDragOpacity 
                                    : 1 
                                : (
                                    // For 2 images, the other image should be visible when dragging in either direction
                                    product.images.length === 2 
                                        ? (index !== activeImage ? (isDragOver ? (x.get() > 0 ? prevDragOpacity : nextDragOpacity) : 0) : 0)
                                        : (
                                            // For 3+ images, use the regular logic
                                            index === nextImage 
                                                ? isDragOver ? nextDragOpacity : 0 
                                                : index === prevImage 
                                                    ? isDragOver ? prevDragOpacity : 0 
                                                    : 0
                                        )
                                )
                        }}
                    >
                        <Image
                            quality={100}
                            src={image}
                            alt={`${product.title[locale]} - Image ${index + 1}`}
                            width={1476}
                            height={1838}
                            className={`max-h-full lg:h-full w-auto max-w-full mx-auto rounded-lg lg:rounded-2xl object-contain ${activeImage === index ? "z-[1000]" : "z-0"}`}
                        />
                    </motion.div>
                ))}
                
            </motion.div>

            <div className="hidden gap-4 justify-center lg:flex" onMouseDown={(e) => {e.stopPropagation()}}>
                {product.images.map((image, index) => (
                    <button 
                        disabled={!isDragOver}
                        key={index} 
                        onClick={() => {setActiveImage(index)}}
                        className={`cursor-pointer relative after:content-[''] after:absolute after:w-full after:h-full after:rounded-lg after:bg-black after:top-0 after:left-0 after:transition after:duration-300 ${activeImage === index ? "after:opacity-0" : "after:opacity-50"}`}
                        aria-label={`View image ${index + 1}`}
                        aria-current={activeImage === index ? "true" : "false"}
                    >
                        <Image
                            unoptimized
                            quality={100}
                            src={image}
                            alt={`${product.title[locale]} thumbnail ${index + 1}`}
                            width={194} // Doubled width
                            height={194} // Doubled height
                            className='rounded-lg size-24 object-cover'
                        />
                    </button>
                ))}
            </div>
            
            <button
                className='hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 cursor-pointer'
                onMouseDown={(e) => {e.stopPropagation()}}
                onClick={nextSlide}
                aria-label="Next image"
            >
                <ArrowRight className='text-white size-8' strokeWidth={1.5} />
            </button>
            
            <button 
                className='hidden lg:block absolute left-16 top-1/2 -translate-y-1/2 cursor-pointer' 
                onMouseDown={(e) => {e.stopPropagation()}} 
                onClick={prevSlide}
                aria-label="Previous image"
            >
                <ArrowLeft className='text-white size-8' strokeWidth={1.5} />
            </button>
            
            <button 
                className='absolute right-4 lg:right-16 top-4 lg:top-6 cursor-pointer'
                onClick={closeCarousel}
                aria-label="Close carousel"
            >
                <X className='text-white size-6 lg:size-8' strokeWidth={1.5} />
            </button>
        </motion.div>
    )
}