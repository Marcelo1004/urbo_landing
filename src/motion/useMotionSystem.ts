import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Configure GSAP defaults
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

export function useMotionSystem() {
  useEffect(() => {
    // 100% Native High-Performance Smooth Scroll with GSAP ScrollTrigger
    ScrollTrigger.config({
      ignoreMobileResize: true,
      limitCallbacks: true,
      syncInterval: 100,
    });

    // Refresh ScrollTrigger on window resize smoothly
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}
