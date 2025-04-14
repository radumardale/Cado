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

    const moveItemsForward = () => {
      if (isAnimationPlaying) return;

        setIsMovingForward(true);
        setSliderInitialized(true);
        setAnimationPlaying(true);

        setTimeout(() => {
            setAnimationPlaying(false);
        }, 1000)

        setSteps(steps.map((obj) => {
        const newValue = obj.value + 1;
        return {
            ...obj,
            value: newValue > steps.length - 1 ? 0 : newValue
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
        }, 1000)

        setSteps(steps.map((obj) => {
        const newValue = obj.value - 1;
        return {
            ...obj,
            value: newValue < 0 ? steps.length - 1 : newValue
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
                    steps.map( (obj, index) => {
                        return (
                            <motion.div 
                                animate={
                                    isSlideInitialized ? (
                                        isMovingForward ? (
                                            obj.value === steps.length - 3 ? {
                                                x: [null, `${(isDesktop ? 8.5 : 6) * 1.3}rem`, `${obj.value * 1.5}rem`],
                                            } : {
                                                x: [`${(obj.value - 1) * 1.5}rem`, `${(obj.value - 1) * 1.5}rem`, `${obj.value * 1.5}rem`],
                                            }
                                        ) : ( 
                                                obj.value === 2 ? {
                                                    x: [null, `${(isDesktop ? 8.5 : 6) * 1.3 + (obj.value - 1) * 1.5}rem`, `${(steps.length - 1) * 1.5}rem`],
                                                } : {
                                                    x: [`${(obj.value + 1) * 1.5}rem`, `${(obj.value + 1) * 1.5}rem`, `${obj.value * 1.5}rem`],
                                                }
                                            )
                                    ) : {
                                        x: `${obj.value * 1.5}rem`,
                                        transition: {
                                            duration: 0
                                        }
                                    }
                                }
                                style={{zIndex: obj.value}}
                                key={index}
                                data-index={obj.value}
                                transition={{
                                    duration: 0.8,
                                    ease: easeInOutCubic,
                                }} 
                                className={`size-24 lg:size-34 rounded-2xl overflow-hidden absolute transition-[z-index] delay-300`}
                            >
                                <Image src={obj.src} alt='asf' width={120} height={120} className='h-full w-full object-cover' />
                            </motion.div>
                        )
                    })
                }
            </div>
        </div>

        <TitlesCarousel slide={steps[steps.length - 1].value} isAnimationPlaying={isAnimationPlaying} moveItemsBackward={moveItemsBackward} moveItemsForward={moveItemsForward}  />
    </>
  )
}