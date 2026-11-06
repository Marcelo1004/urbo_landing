import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.85 });

export function useMotionSystem() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;

    if (!reduceMotion) {
      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      // Scroll reveals for sections
      const sections = document.querySelectorAll('section');
      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0.9, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      return () => {
        gsap.ticker.remove(tickerCallback);
        lenis?.destroy();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, []);
}

