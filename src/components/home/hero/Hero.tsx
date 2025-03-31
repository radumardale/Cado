'use client'

import { heroImages } from '@/lib/constants';
import { useRef, useState } from 'react'
import ImageSlide from './ImageSlide';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Hero() {
    const [slide, setSlide] = useState(0);
    const [nextSlideState, setNextSlideState] = useState(1);
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const nextSlide = () => {
      if (isAnimationPlaying) return;
  
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
  
      // const tempSlide = slide === heroImages.length - 1 ? 0 : slide + 1;
      setIsAnimationPlaying(true);
      setSlide(slide === heroImages.length - 1 ? 0 : slide + 1);
      setNextSlideState(slide + 1 >= heroImages.length - 1 ? 0 : slide + 1);
      
      console.log(slide, nextSlideState);

      setTimeout(() => {
        setIsAnimationPlaying(false);
      }, 1000);
  
      // intervalRef.current = setInterval(nextSlide, 5000);
    }

    const previousSlide = () => {
      if (isAnimationPlaying) return;
  
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
  
      setIsAnimationPlaying(true);
      setSlide(slide => slide === 0 ? heroImages.length - 1 : slide - 1);
      setNextSlideState(slide === 0 ? heroImages.length - 1 : slide - 1);
  
      setTimeout(() => {
        setIsAnimationPlaying(false);
      }, 1000);
  
      // intervalRef.current = setInterval(nextSlide, 5000);
    }

    const setToSlide = (slide: number) => {
      if (isAnimationPlaying) return;

      setIsAnimationPlaying(true);
      setSlide(slide);
  
      setTimeout(() => {
        setIsAnimationPlaying(false);
      }, 1000);
    }

    // useEffect(() => {
    //   // Initial interval setup
    //   intervalRef.current = setInterval(nextSlide, 5000);
  
    //   // Cleanup
    //   return () => {
    //     if (intervalRef.current) {
    //       clearInterval(intervalRef.current);
    //     }
    //   };
    // }, [isAnimationPlaying]);

  return (
    <div className='col-span-full aspect-[112/50] overflow-hidden rounded-3xl relative'>
      <ArrowRight className='absolute top-1/2 -translate-y-1/2 right-6 z-20 text-pureblack cursor-pointer' onClick={nextSlide}/>
      <ArrowLeft className='absolute top-1/2 -translate-y-1/2 left-6 z-20 text-pureblack cursor-pointer' onClick={previousSlide}/>
      <div className="flex gap-6 absolute left-1/2 -translate-x-1/2 bottom-6 z-20">
        {
          heroImages.map((image, index) => {
             return (
              <div key={index} className='h-4 flex items-end cursor-pointer' onClick={() => {setToSlide(index)}}>
                <button className={`h-0.5 w-18 transition duration-200 rounded-2xl ${slide === index ? "bg-black" : "bg-gray"}`}></button>
              </div>
            )
          })
        }
      </div>
      {
        heroImages.map((image, index) => {
          return <ImageSlide key={index} src={image} index={index} slide={slide} nextSlide={nextSlideState}/>
        })
      }
    </div>
  )
}
