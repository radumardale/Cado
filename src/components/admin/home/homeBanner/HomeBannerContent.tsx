'use client';
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ImageSlide from '@/components/home/hero/ImageSlide';
import { useTRPC } from '@/app/_trpc/client';
import NewBannerSlide from './NewBannerSlide';
import NewBannerForm from './NewBannerForm';
import DeleteBannerForm from './DeleteBannerForm';

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from 'next-intl';

export enum carousellDirection {
    "FORWARD",
    "BACKWARDS"
}

export default function HomeBannerContent() {
    const trpc = useTRPC();
    const { data: HomeBannerQuery, refetch } = useQuery(trpc.home_banner.getAllHomeBanners.queryOptions());

    const [slide, setSlide] = useState(-1);
    const [nextSlideState, setNextSlideState] = useState(0);
    const [slideNumber, setSlideNumber] = useState(0);
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const [direction, setDirection] = useState<carousellDirection>(carousellDirection.FORWARD);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const [selectedImages, setSelectedImages] = useState<{
        ro: string | null;
        ru: string | null;
        en: string | null;
    }>({
        ro: null,
        ru: null,
        en: null
    });

    // Computed values to track banner state
    const totalExistingBanners = HomeBannerQuery?.banners?.length || 0;
    const newBannerSlideIndex = totalExistingBanners; // Romanian new banner index
    const ruNewBannerSlideIndex = totalExistingBanners + 1; // Russian new banner index  
    const enNewBannerSlideIndex = totalExistingBanners + 2; // English new banner index
    const totalSlides = totalExistingBanners + 1;

    // Current banner tracking
    const currentBanner = slideNumber < totalExistingBanners ? HomeBannerQuery?.banners[slideNumber] : null;

    const refetchBanners = () => {
      refetch()
    }

    const handleMainImageAdded = (imageBase64: string, language: string = "ro") => {
        setSelectedImages(prev => ({
            ...prev,
            [language]: imageBase64
        }));
    };

    const resetSelectedImages = () => {
        setSelectedImages({
            ro: null,
            ru: null,
            en: null
        });
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

    const t = useTranslations("Admin.AdminHomePage");

    return (
        <>
            <p className='mt-[3rem] font-manrope text-[1.5rem] font-bold mb-[1.5rem] col-span-full'>{t('banner_ro')}</p>
            <div className='col-span-full overflow-hidden rounded-2xl lg:rounded-3xl relative mb-6'>
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
                                src={banner.images.ro} 
                                index={index} 
                                slide={slide} 
                                nextSlide={nextSlideState} 
                                direction={direction}
                            />
                        )
                    })}
                    <NewBannerSlide 
                        selectedImage={selectedImages.ro} 
                        index={newBannerSlideIndex} 
                        slide={slide} 
                        nextSlide={nextSlideState} 
                        direction={direction} 
                        onImageAdded={handleMainImageAdded}
                        language='ro'
                    />
                </div>
            </div>

            {/* Russian and English banners */}
            <div className="col-span-full w-full flex gap-4 lg:gap-6 mb-6">
                {/* Russian banner */}
                <div className='flex-1'>
                    <p className='font-manrope text-[1.5rem] font-bold mb-[1.5rem]'>{t('banner_ru')}</p>
                    <div className='overflow-hidden rounded-2xl lg:rounded-3xl relative'>
                        <div className='aspect-[358/362] lg:aspect-[112/50] relative w-full h-full'>
                            {HomeBannerQuery?.banners.map((banner, index) => {
                                return (
                                    <ImageSlide 
                                        key={`ru-${banner._id || index}`} 
                                        src={banner.images.ru} 
                                        index={index} 
                                        slide={slide} 
                                        nextSlide={nextSlideState} 
                                        direction={direction}
                                    />
                                )
                            })}
                            <NewBannerSlide 
                                selectedImage={selectedImages.ru} 
                                index={ruNewBannerSlideIndex} 
                                slide={slide} 
                                nextSlide={nextSlideState} 
                                direction={direction} 
                                onImageAdded={handleMainImageAdded}
                                language='ru'
                            />
                        </div>
                    </div>
                </div>

                {/* English banner */}
                <div className='flex-1 '>
                    <p className='font-manrope text-[1.5rem] font-bold mb-[1.5rem]'>{t('banner_en')}</p>
                    <div className='overflow-hidden rounded-2xl lg:rounded-3xl relative'>
                        <div className='aspect-[358/362] lg:aspect-[112/50] relative w-full h-full'>
                            {HomeBannerQuery?.banners.map((banner, index) => {
                                return (
                                    <ImageSlide 
                                        key={`en-${banner._id || index}`} 
                                        src={banner.images.en} 
                                        index={index} 
                                        slide={slide} 
                                        nextSlide={nextSlideState} 
                                        direction={direction}
                                    />
                                )
                            })}
                            <NewBannerSlide 
                                selectedImage={selectedImages.en} 
                                index={enNewBannerSlideIndex} 
                                slide={slide} 
                                nextSlide={nextSlideState} 
                                direction={direction} 
                                onImageAdded={handleMainImageAdded}
                                language='en'
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {!currentBanner ? 
                <NewBannerForm selectedImages={selectedImages} refetchBanners={refetchBanners} resetSelectedImages={resetSelectedImages}/> :
                <DeleteBannerForm id={currentBanner._id} ocasion={currentBanner.ocasion} refetchBanners={refetchBanners}/>
            }
        </>
    )
}