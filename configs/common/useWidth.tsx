"use client";

import { useState, useEffect } from 'react';
import themeConfig from './themeConfig';

export default function useWidth() {
  // states
  const [width, setWidth] = useState<number | null>(null);

  // breakpoints
  const breakpoints = themeConfig.breakpoints;

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width if window is defined
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    // Cleanup the event listener
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return { width, breakpoints };
}
