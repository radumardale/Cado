'use client';

import React, { useEffect, useState } from 'react';
import { Toaster } from './ui/sonner';

export default function ResponsiveToaster() {
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

  return (
    <Toaster position={isDesktop ? 'top-center' : 'top-center'} visibleToasts={2} duration={2000} />
  );
}
