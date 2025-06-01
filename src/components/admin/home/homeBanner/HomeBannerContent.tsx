'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ImageSlide from '@/components/home/hero/ImageSlide';
import { trpc } from '@/app/_trpc/client';
import NewBannerSlide from './NewBannerSlide';
import NewBannerForm from './NewBannerForm';
import DeleteBannerForm from './DeleteBannerForm';

export enum carousellDirection {
    "FORWARD",
    "BACKWARDS"
}  

export default function HomeBannerContent() {
    const { data: HomeBannerQuery, refetch } = trpc.home_banner.getAllHomeBanners.useQuery();

    const [slide, setSlide] = useState(-1);
    const [nextSlideState, setNextSlideState] = useState(0);
    const [slideNumber, setSlideNumber] = useState(0);
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const [direction, setDirection] = useState<carousellDirection>(carousellDirection.FORWARD);
    const intervalRef = useRef<NodeJS.Timeout>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Computed values to track banner state
    const totalExistingBanners = HomeBannerQuery?.banners?.length || 0;
    const newBannerSlideIndex = totalExistingBanners; // Last position is for new banner
    const totalSlides = totalExistingBanners + 1; // Including new banner slide
    
    // Current banner tracking
    const currentBanner = slideNumber < totalExistingBanners ? HomeBannerQuery?.banners[slideNumber] : null;

    const refetchBanners = () => {
      refetch()
    }

    const handleMainImageAdded = (imageBase64: string) => {
        setSelectedImage(imageBase64);
    };

    const nextSlide = () => {
        if (isAnimationPlaying) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setSlide(nextSlideState);
        
        // Fixed calculation to include new banner slide
        const newSlideNumber = slideNumber + 1 >= totalSlides ? 0 : slideNumber + 1;
        const newNextSlideState = nextSlideState + 1 >= totalSlides ? 0 : nextSlideState + 1;
        
        setSlideNumber(newSlideNumber);
        setNextSlideState(newNextSlideState);
        setIsAnimationPlaying(true);
        setDirection(carousellDirection.FORWARD);
        
        setTimeout(() => {
            setIsAnimationPlaying(false);
        }, 1000);
    }

    const previousSlide = () => {
        if (isAnimationPlaying) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setIsAnimationPlaying(true);
        
        setSlide(nextSlideState);
        
        // Fixed calculation to include new banner slide
        const newSlideNumber = slideNumber === 0 ? totalSlides - 1 : slideNumber - 1;
        const newNextSlideState = nextSlideState === 0 ? totalSlides - 1 : nextSlideState - 1;
        
        setSlideNumber(newSlideNumber);
        setNextSlideState(newNextSlideState);
        setDirection(carousellDirection.BACKWARDS);

        setTimeout(() => {
            setIsAnimationPlaying(false);
        }, 1000);
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
    }

    useEffect(() => {
        // Cleanup interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <>
            <div className='col-span-full overflow-hidden rounded-2xl lg:rounded-3xl relative mb-6 mt-16'>
                <ArrowRight className='absolute top-1/2 -translate-y-1/2 right-2 lg:right-6 z-20 text-blue-4 cursor-pointer' onClick={nextSlide}/>
                <ArrowLeft className='absolute top-1/2 -translate-y-1/2 left-2 lg:left-6 z-20 text-blue-4 cursor-pointer' onClick={previousSlide}/>
                
                <div className="flex gap-4 lg:gap-6 absolute w-full lg:w-fit left-1/2 -translate-x-1/2 bottom-2 lg:bottom-6 z-20 px-4 lg:px-0">
                    {Array.from({length: totalSlides}).map((_, index) => {
                        return (
                            <div key={index} className='lg:py-4 cursor-pointer flex-1 lg:flex-auto' onClick={() => {setToSlide(index)}}>
                                <button className={`h-0.5 w-full lg:w-18 pointer-events-none transition duration-200 rounded-2xl ${
                                    slideNumber === index ? "bg-blue-4" : "bg-gray"
                                }`}></button>
                            </div>
                        )
                    })}
                </div>
                
                <div className='aspect-[358/362] lg:aspect-[112/50] relative w-full'>
                    {HomeBannerQuery?.banners.map((banner, index) => {
                        return (
                            <ImageSlide 
                                key={banner._id || index} 
                                src={banner.image} 
                                index={index} 
                                slide={slide} 
                                nextSlide={nextSlideState} 
                                direction={direction}
                            />
                        )
                    })}
                    <NewBannerSlide 
                        selectedImage={selectedImage} 
                        index={newBannerSlideIndex} 
                        slide={slide} 
                        nextSlide={nextSlideState} 
                        direction={direction} 
                        onImageAdded={handleMainImageAdded}
                    />
                </div>
            </div>
            
            {!currentBanner ? 
                <NewBannerForm selectedImage={selectedImage} refetchBanners={refetchBanners} setSelectedImage={setSelectedImage}/> :
                <DeleteBannerForm id={currentBanner._id} ocasion={currentBanner.ocasion} refetchBanners={refetchBanners}/>
            }
        </>
    )
}