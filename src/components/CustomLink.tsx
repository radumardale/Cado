'use client';

import { Link } from '@/i18n/navigation';
import { Pathnames } from '@/i18n/routing';
import { easeInOutCubic } from '@/lib/utils';
import { motion } from 'motion/react';
import { useState } from 'react';

interface CustomLinkInterface {
  href: Pathnames;
  ocasion?: string;
  className?: string;
  value: string;
}

export default function CustomLink({ href, className, value, ocasion }: CustomLinkInterface) {
  const [isLinkActive, seIsLinkActive] = useState(false);

  const linkVariants = {
    initial: {
      y: 0,
    },
    open: {
      y: '-50%',
    },
  };

  return (
    <div
      className={`overflow-hidden relative ${className}`}
      onMouseEnter={() => {
        seIsLinkActive(true);
      }}
      onMouseLeave={() => {
        seIsLinkActive(false);
      }}
    >
      <p className='pointer-events-none invisible whitespace-nowrap'>{value}</p>
      <Link href={{ pathname: href, query: ocasion ? { ocasions: ocasion } : {} }}>
        <motion.div
          className='flex flex-col absolute left-0 top-0'
          variants={linkVariants}
          animate={isLinkActive ? 'open' : 'initial'}
          transition={{ ease: easeInOutCubic, duration: 0.45 }}
          initial={false}
        >
          <p className='pb-2'>{value}</p>
          <p className='pb-2'>{value}</p>
        </motion.div>
      </Link>
    </div>
  );
}
