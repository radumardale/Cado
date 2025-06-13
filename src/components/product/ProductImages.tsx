import { ProductInterface } from "@/models/product/types/productInterface";
import { useLocale } from "next-intl";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ImagesCarousel from "./ImagesCarousel";
import { useLenis } from "lenis/react";
import { AnimatePresence } from "motion/react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, PanInfo, useMotionValue, useTransform } from "motion/react";

interface ProductImagesInterface {
  product: ProductInterface;
}

export default function ProductImages({ product }: ProductImagesInterface) {
  const [isCarouselOpen, setCarouselOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const locale = useLocale();
  const lenis = useLenis();
  const swiperRef = useRef<SwiperRef>(null);
  const [isDragOver, setDragOver] = useState(true);
  const [nextImage, setNextImage] = useState(
    (imageIndex + 1) % product.images.length
  );
  const [prevImage, setPrevImage] = useState(
    imageIndex - 1 < 0 ? product.images.length - 1 : imageIndex - 1
  );
  const [isDrag, setIsDrag] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [swiperLoaded, setSwiperLoaded] = useState(false);
  const hasMultipleImages = product.images.length > 1;

  useEffect(() => {
    setSwiperLoaded(true);
  }, []);

  useEffect(() => {
    if (!swiperRef.current?.swiper) return;

    const swiper = swiperRef.current.swiper;

    // Update states initially
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);

    // Set up event listeners
    const updateNavStates = () => {
      setIsFirstSlide(swiper.isBeginning);
      setIsLastSlide(swiper.isEnd);
    };

    swiper.on("slideChange", updateNavStates);
    swiper.on("snapGridLengthChange", updateNavStates); // Important for when slides are added/removed

    return () => {
      swiper.off("slideChange", updateNavStates);
      swiper.off("snapGridLengthChange", updateNavStates);
    };
  }, [swiperRef.current?.swiper]);

// Motion values for drag and opacity - improved for 2-image case
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

useEffect(() => {
  if (!hasMultipleImages) return; // Don't animate if there's only 1 image
  
  setDragOver(false);
  setTimeout(() => {
    setDragOver(true);
    
    // For 2 images, next is always the other image
    if (product.images.length === 2) {
      setNextImage(imageIndex === 0 ? 1 : 0);
      setPrevImage(imageIndex === 0 ? 1 : 0);
    } else {
      // For 3+ images, use modular arithmetic
      setNextImage((imageIndex + 1) % product.images.length);
      setPrevImage(imageIndex - 1 < 0 ? product.images.length - 1 : imageIndex - 1);
    }
  }, 300);
}, [imageIndex, product.images.length, hasMultipleImages]);

const handleDragEnd = (
  event: MouseEvent | TouchEvent | PointerEvent,
  info: PanInfo
) => {
  if (!hasMultipleImages) return; // Don't handle drag for single image
  
  const threshold = 150;
  
  if (info.offset.x > threshold) {
    // For 2 images, when dragging right, always go to the other image
    if (product.images.length === 2) {
      setImageIndex(imageIndex === 0 ? 1 : 0);
    } else {
      setImageIndex(prevImage);
    }
  } else if (info.offset.x < -threshold) {
    // For 2 images, when dragging left, always go to the other image
    if (product.images.length === 2) {
      setImageIndex(imageIndex === 0 ? 1 : 0);
    } else {
      setImageIndex(nextImage);
    }
  }
  
  setTimeout(() => {
    setIsDrag(false);
  }, 50);
  
  // Reset the drag position
  x.set(0);
};

  useEffect(() => {
    if (isCarouselOpen) {
      lenis?.stop();
      window.document.body.classList.add("carousel");
    } else {
      lenis?.start();
      window.document.body.classList.remove("carousel");
    }
  }, [isCarouselOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys if there are multiple images
      if (product.images.length <= 1) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (product.images.length === 2) {
            setImageIndex(imageIndex === 0 ? 1 : 0);
          } else {
            setImageIndex(prevImage);
          }
          break;
          
        case 'ArrowRight':
          event.preventDefault();
          if (product.images.length === 2) {
            setImageIndex(imageIndex === 0 ? 1 : 0);
          } else {
            setImageIndex(nextImage);
          }
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageIndex, prevImage, nextImage, product.images.length]);
 
  return (
    <>
      <AnimatePresence>
        {isCarouselOpen && (
          <ImagesCarousel
            initialActive={imageIndex}
            product={product}
            locale={locale}
            setCarouselOpen={setCarouselOpen}
          />
        )}
      </AnimatePresence>
      <div className="relative col-span-full lg:col-start-2 lg:col-span-5 grid grid-cols-5 lg:grid-cols-5 mt-2 lg:mt-16 gap-x-6 mb-4 lg:mb-31 h-fit cursor-pointer -ml-4 w-[calc(100%+2rem)] lg:mx-0 lg:w-full px-4 lg:px-0 overflow-hidden lg:overflow-visible">


        <div className="absolute top-2 lg:top-4 left-6 lg:left-4 bg-black/75 text-white px-6 py-2 rounded-3xl font-manrope font-semibold z-20">
          {imageIndex + 1} / {product.images.length}
        </div>
        <div className="w-full h-full col-span-full overflow-hidden rounded-lg lg:rounded-2xl relative">

          {product.images.length > 1 && (
              <>
                <ArrowRight 
                  className='absolute top-1/2 -translate-y-1/2 right-4 z-20 text-blue-4 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add your navigation logic here
                    if (product.images.length === 2) {
                      setImageIndex(imageIndex === 0 ? 1 : 0);
                    } else {
                      setImageIndex(nextImage);
                    }
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                />
                <ArrowLeft 
                  className='absolute top-1/2 -translate-y-1/2 left-4 z-20 text-blue-4 cursor-pointer' 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.images.length === 2) {
                      setImageIndex(imageIndex === 0 ? 1 : 0);
                    } else {
                      setImageIndex(prevImage);
                    }
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                />
              </>
            )}

          <motion.div
            className="bg-purewhite rounded-lg lg:rounded-2xl flex-1 relative top-0 lg:relative mb-4 w-full max-w-full cursor-grab box-border aspect-[4/5] col-span-full"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            drag={isDragOver ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.05}
            dragMomentum={false}
            dragTransition={{
              bounceStiffness: 600,
              bounceDamping: 30,
            }}
            onClick={() => {
              if (!isDrag) setCarouselOpen(true);
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
    className="pointer-events-none w-full rounded-2xl absolute h-full flex justify-center items-center"
    style={{
      opacity: index === imageIndex 
        ? isDragOver 
          ? activeDragOpacity 
          : 1 
        : (
          // For 2 images, the other image should always be both prev and next
          product.images.length === 2 
            ? (index !== imageIndex ? (isDragOver ? (x.get() > 0 ? prevDragOpacity : nextDragOpacity) : 0) : 0)
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
      onDragStart={(e) => e.preventDefault()}
      quality={100}
      src={image}
      alt={`${product.title[locale]} - Image ${index + 1}`}
      width={1476}
      height={1838}
      className={`max-h-full w-auto mx-auto max-w-full object-contain select-none ${
        imageIndex === index ? "z-10" : "z-0"
      }`}
    />
  </motion.div>
))}
          </motion.div>
        </div>

        <div className="col-span-full relative group hidden lg:block">
          {product.images.length >= 6 && (
            <>
              <button
                className={`absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full cursor-pointer transition duration-200 ${
                  isLastSlide
                    ? "opacity-25 cursor-not-allowed"
                    : "opacity-25 group-hover:opacity-100"
                }`}
                onClick={() => {
                  if (!isLastSlide && swiperRef.current?.swiper) {
                    swiperRef.current.swiper.slideNext();
                  }
                }}
                disabled={isLastSlide}
                aria-label="Next slide"
              >
                <ChevronRight className="size-6" strokeWidth={1.5} />
              </button>
              <button
                className={`absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full cursor-pointer transition duration-200 ${
                  isFirstSlide
                    ? "opacity-25 cursor-not-allowed"
                    : "opacity-25 group-hover:opacity-100"
                }`}
                onClick={() => {
                  if (!isFirstSlide && swiperRef.current?.swiper) {
                    swiperRef.current.swiper.slidePrev();
                  }
                }}
                disabled={isFirstSlide}
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-6" strokeWidth={1.5} />
              </button>
            </>
          )}
          {
            !swiperLoaded ?
            <div className="flex w-[calc(100%+1.5rem)] h-auto">
              {product.images.map((image, index) => (
              <div key={index} className="max-w-1/5 pr-6">
                <button
                  className="cursor-pointer flex-1 aspect-square lg:w-full"
                  onClick={() => {
                    setImageIndex(index);
                  }}
                >
                  <Image
                    unoptimized
                    quality={100}
                    src={image}
                    alt={product.title[locale]}
                    width={254}
                    height={318}
                    className="rounded-sm lg:rounded-2xl w-full h-full object-cover"
                  />
                </button>
              </div>
            ))}
            </div>
            :
          <Swiper
            ref={swiperRef}
            slidesPerView={5}
            spaceBetween={16}
            breakpoints={{
              // For larger screens, use more space
              1024: {
                spaceBetween: 14 * 1.5,
              },
              1636: {
                spaceBetween: 16 * 1.5,
              },
            }}
            className={`h-auto w-full flex`}
            speed={400}
            style={
              {
                "--swiper-transition-timing-function":
                  "cubic-bezier(0.65, 0, 0.35, 1)",
              } as React.CSSProperties
            }
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index} className="aspect-square">
                <button
                  className="cursor-pointer flex-1 aspect-square lg:w-full"
                  onClick={() => {
                    setImageIndex(index);
                  }}
                >
                  <Image
                    unoptimized
                    quality={100}
                    src={image}
                    alt={product.title[locale]}
                    width={254}
                    height={318}
                    className="rounded-sm lg:rounded-2xl w-full h-full object-cover"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          }
        </div>
      </div>
    </>
  );
}
