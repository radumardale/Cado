'use client';

import { Menu } from 'lucide-react';
import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { AnimatePresence } from 'motion/react';
import MobileMenu from './MobileMenu';

interface MobileMenuIconProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

export default function MobileMenuIcon({ isSidebarOpen, setSidebarOpen }: MobileMenuIconProps) {
  const lenis = useLenis();

  useEffect(() => {
    if (isSidebarOpen) {
      lenis?.stop();
      window.document.body.classList.add('carousel');
    } else {
      lenis?.start();
      window.document.body.classList.remove('carousel');
    }
  }, [isSidebarOpen]);

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && <MobileMenu setSidebarOpen={setSidebarOpen} />}
      </AnimatePresence>
      <button
        className='relative cursor-pointer'
        onClick={() => {
          setSidebarOpen(true);
        }}
      >
        <Menu className='size-6' strokeWidth={1.25} />
      </button>
    </>
  );
}
