import Image from 'next/image';
import React from 'react';
import { motion } from 'motion/react';
import { easeInOutCubic } from '@/lib/utils';
import { carousellDirection } from './Hero';
import { Link } from '@/i18n/navigation';
import { Ocasions } from '@/lib/enums/Ocasions';

interface ImageSlideInterface {
  src: string;
  slide: number;
  nextSlide: number;
  index: number;
  direction: carousellDirection;
  ocasion?: Ocasions;
}

export default function ImageSlide({
  src,
  slide,
  nextSlide,
  index,
  direction,
  ocasion,
}: ImageSlideInterface) {
  const slideVariants = {
    initial: {
      clipPath:
        direction === carousellDirection.FORWARD ? 'inset(0px 0% 0px 0px)' : 'inset(0px 0% 0px 0%)',
      transition: {
        duration: 0,
      },
    },
    animate: {
      clipPath:
        direction === carousellDirection.FORWARD
          ? 'inset(0px 100% 0px 0px)'
          : 'inset(0px 0px 0px 100%)',
    },
  };

  return (
    <motion.div
      variants={slideVariants}
      transition={{ ease: easeInOutCubic, duration: 0.8 }}
      initial={false}
      animate={slide === index ? 'animate' : 'initial'}
      style={{ zIndex: slide === index ? 4 : nextSlide === index ? 3 : 0 }}
      className='absolute left-0 top-0 w-full h-full'
    >
      {ocasion ? (
        <Link
          href={{ pathname: '/catalog', query: { ocasions: ocasion } }}
          className='w-full h-full'
        >
          <Image
            quality={90}
            priority
            src={src}
            alt='hero1'
            width={3584}
            height={1600}
            className='w-full h-full object-cover'
          />
        </Link>
      ) : (
        <Image
          quality={90}
          priority
          src={src}
          alt='hero1'
          width={3584}
          height={1600}
          className='w-full h-full object-cover'
        />
      )}
    </motion.div>
  );
}
