'use client'

import { reviewLogos } from '@/lib/constants';
import { easeInOutCubic } from '@/lib/utils';
import { motion } from 'motion/react'
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react'
import TextCarousel from './TextCarousel';
import TitlesCarousel from './TitlesCarousel';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface LogoCardInterface {
    src: string,
    value: number
}

export default function LogoCarousel() {
    const [steps, setSteps] = useState<LogoCardInterface[]>(reviewLogos);
    const [isSlideInitialized, setSliderInitialized] = useState(false);
    const [isAnimationPlaying, setAnimationPlaying] = useState(false);
    const [isMovingForward, setIsMovingForward] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout>(null);
    const [isDesktop, setIsDesktop] = useState(false);
  
    // Check screen size on mount and window resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        
        // Set initial state
        checkScreenSize();
        
        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);
        
        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        // Initial interval setup
        intervalRef.current = setInterval(moveItemsForward, 5000);
    
        // Cleanup
        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      }, [isAnimationPlaying]);

      // At the beginning of your component
    const totalItems = steps.length;

    // When initializing steps
    useEffect(() => {
    // Make sure the number of positions equals the number of items
    const initialSteps: LogoCardInterface[] = [];
    for (let i = 0; i < totalItems; i++) {
        initialSteps.push(steps[i]);
    }
    setSteps(initialSteps);
    }, [totalItems]);

    const moveItemsForward = () => {
        if (isAnimationPlaying) return;
      
        setIsMovingForward(true);
        setSliderInitialized(true);
        setAnimationPlaying(true);
      
        setTimeout(() => {
          setAnimationPlaying(false);
        }, 1000);
      
        // Update using functional update to ensure we have latest state
        setSteps(prevSteps => prevSteps.map((obj) => {
          const newValue = (obj.value + 1) % totalItems; // Use modulo for clean wraparound
          return {
            ...obj,
            value: newValue
          };
        }));
      
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      
        intervalRef.current = setInterval(moveItemsForward, 5000);
      };
      
      const moveItemsBackward = () => {
        if (isAnimationPlaying) return;
      
        setIsMovingForward(false);
        setSliderInitialized(true);
        setAnimationPlaying(true);
      
        setTimeout(() => {
          setAnimationPlaying(false);
        }, 1000);
      
        // Update using functional update
        setSteps(prevSteps => prevSteps.map((obj) => {
          // For backward movement with any number of items
          const newValue = (obj.value - 1 + totalItems) % totalItems;
          return {
            ...obj,
            value: newValue
          };
        }));
      
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        intervalRef.current = setInterval(moveItemsForward, 5000);
      };

  return (
    <>
        <TextCarousel slide={steps[steps.length - 1].value} />

        <div className='flex justify-center col-span-full h-24 lg:h-34 mb-4 lg:mb-12 relative'>
            <button className='lg:hidden cursor-pointer disabled:pointer-events-none top-1/2 -translate-y-1/2 absolute right-0' disabled={isAnimationPlaying} onClick={moveItemsForward}>
                <ArrowRight strokeWidth={1.5} className='size-6'/>
            </button>
            <button className='lg:hidden cursor-pointer disabled:pointer-events-none top-1/2 -translate-y-1/2 absolute left-0' disabled={isAnimationPlaying} onClick={moveItemsBackward}>
                <ArrowLeft strokeWidth={1.5} className='size-6'/>
            </button>
            <div className="relative" style={{width: `calc(${(steps.length - 1) * 1.5}rem + ${isDesktop ? "8.5" : "6"}rem)`}}>
                {
                  steps.map((obj, index) => {
                    // Calculate slide width based on device
                    const slideWidth = isDesktop ? 8.5 : 6;  // in rem
                    const gap = 1.5;  // Gap between slides in rem
                    
                    // Calculate the total number of slides
                    const totalSlides = steps.length;
                    
                    // Calculate the position based on value (0-indexed)
                    const normalPosition = obj.value * gap;
                    
                    // Calculate positions for edge cases (first/last slides)
                    const lastSlideIndex = totalSlides - 1;
                    const wrappingForwardPosition = slideWidth * 1.43;  // Position for wrapping forward
                    const wrappingBackwardPosition = (slideWidth * 1.25) + ((obj.value - 1) * gap);  // Position for wrapping backward
                    
                    // Calculate animation values based on direction and position
                    let animationValues = {};
                    
                    if (isSlideInitialized) {
                        if (isMovingForward) {
                            // Moving forward (left to right)
                            if (obj.value === 0) {
                                // Item wrapping from end to beginning
                                animationValues = {
                                    x: [null, `${wrappingForwardPosition}rem`, `${normalPosition}rem`],
                                };
                            } else {
                                // Standard forward movement
                                animationValues = {
                                    x: [`${(obj.value - 1) * gap}rem`, `${(obj.value - 1) * gap}rem`, `${normalPosition}rem`],
                                };
                            }
                        } else {
                            // Moving backward (right to left)
                            if (obj.value === lastSlideIndex) {
                                // Item wrapping from beginning to end
                                animationValues = {
                                    x: [null, `${wrappingBackwardPosition}rem`, `${normalPosition}rem`],
                                };
                            } else {
                                // Standard backward movement
                                animationValues = {
                                    x: [`${(obj.value + 1) * gap}rem`, `${(obj.value + 1) * gap}rem`, `${normalPosition}rem`],
                                };
                            }
                        }
                    } else {
                        // Initial positioning without animation
                        animationValues = {
                            x: `${normalPosition}rem`,
                            transition: {
                                duration: 0
                            }
                        };
                    }
                    
                    // Calculate z-index based on position
                    // Items in the center have higher z-index
                    const zIndex = obj.value === lastSlideIndex ? totalSlides + 1 : obj.value + 1;
                    
                    return (
                        <motion.div 
                            animate={animationValues}
                            style={{ zIndex: zIndex }}
                            key={index}
                            data-index={obj.value}
                            transition={{
                                duration: 0.8,
                                ease: easeInOutCubic,
                            }} 
                            className={`size-24 lg:size-34 rounded-2xl overflow-hidden absolute transition-[z-index] delay-300`}
                        >
                            <Image 
                                quality={100} 
                                src={obj.src} 
                                alt={`Carousel item ${index + 1}`} 
                                width={120} 
                                height={120} 
                                className='h-full w-full object-cover' 
                            />
                        </motion.div>
                    );
                })
                }
            </div>
        </div>

        <TitlesCarousel slide={steps[steps.length - 1].value} isAnimationPlaying={isAnimationPlaying} moveItemsBackward={moveItemsBackward} moveItemsForward={moveItemsForward}  />
    </>
  )
}