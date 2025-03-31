'use client'

import { heroImages } from '@/lib/constants';
import { useEffect, useRef, useState } from 'react'
import ImageSlide from './ImageSlide';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export enum carousellDirection {
  "FORWARD",
  "BACKWARDS"
}

export default function Hero() {
    const [slide, setSlide] = useState(-1);
    const [nextSlideState, setNextSlideState] = useState(0);
    const [slideNumber, setSlideNumber] = useState(0);
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const [direction, setDirection] = useState<carousellDirection>(carousellDirection.FORWARD);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const nextSlide = () => {
      if (isAnimationPlaying) return;
  
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
  
      setSlide(nextSlideState);
      setSlideNumber(slideNumber + 1 > heroImages.length - 1 ? 0 : slideNumber + 1);
      setIsAnimationPlaying(true);
      setNextSlideState(nextSlideState + 1 > heroImages.length - 1 ? 0 : nextSlideState + 1);
      setDirection(carousellDirection.FORWARD);
      
      setTimeout(() => {
        setIsAnimationPlaying(false);
      }, 1000);
  
      intervalRef.current = setInterval(nextSlide, 5000);
    }

    const previousSlide = () => {
      if (isAnimationPlaying) return;
  
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
  
      setIsAnimationPlaying(true);
      
      setSlide(nextSlideState);
      setSlideNumber(slideNumber === 0 ? heroImages.length - 1 : slideNumber - 1);
      setNextSlideState(nextSlideState === 0 ? heroImages.length - 1 : nextSlideState - 1);
      setDirection(carousellDirection.BACKWARDS);

      setTimeout(() => {
        setIsAnimationPlaying(false);
      }, 1000);
  
      intervalRef.current = setInterval(nextSlide, 5000);
    }

    const setToSlide = (nextSlideNum: number) => {
      if (isAnimationPlaying) return;

      if (nextSlideNum - slideNumber > 0) {
        setDirection(carousellDirection.FORWARD);
      } else if (nextSlideNum - slideNumber < 0) {
        setDirection(carousellDirection.BACKWARDS);
      } else {
        return;
      }

      setSlideNumber(nextSlideNum);
      setSlide(nextSlideState);
      setNextSlideState(nextSlideNum);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setIsAnimationPlaying(true);
  
      setTimeout(() => {
        setIsAnimationPlaying(false);
      }, 1000);

      intervalRef.current = setInterval(nextSlide, 5000);
    }

    useEffect(() => {
      // Initial interval setup
      intervalRef.current = setInterval(nextSlide, 5000);
  
      // Cleanup
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isAnimationPlaying]);

  return (
    <div className='col-span-full aspect-[112/50] overflow-hidden rounded-3xl relative mb-32'>
      <ArrowRight className='absolute top-1/2 -translate-y-1/2 right-6 z-20 text-pureblack cursor-pointer' onClick={nextSlide}/>
      <ArrowLeft className='absolute top-1/2 -translate-y-1/2 left-6 z-20 text-pureblack cursor-pointer' onClick={previousSlide}/>
      <div className="flex gap-6 absolute left-1/2 -translate-x-1/2 bottom-6 z-20">
        {
          heroImages.map((image, index) => {
             return (
              <div key={index} className='py-4 cursor-pointer' onClick={() => {setToSlide(index)}}>
                <button className={`h-0.5 w-18 pointer-events-none transition duration-200 rounded-2xl ${slideNumber === index ? "bg-black" : "bg-gray"}`}></button>
              </div>
            )
          })
        }
      </div>
      {
        heroImages.map((image, index) => {
          return <ImageSlide key={index} src={image} index={index} slide={slide} nextSlide={nextSlideState} direction={direction}/>
        })
      }
    </div>
  )
}
