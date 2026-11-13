import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SectionRevealOptions {
  trigger?: RefObject<HTMLElement | null>;
  start?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  selector?: string;
  onEnter?: () => void;
}

export function useSectionReveal(
  containerRef: RefObject<HTMLElement | null>,
  options: SectionRevealOptions = {}
) {
  const {
    start = 'top 82%',
    y = 35,
    duration = 0.85,
    stagger = 0.08,
    selector = '.reveal-item',
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const targets = container.querySelectorAll(selector);
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start,
            toggleActions: 'play none none none',
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [containerRef, start, y, duration, stagger, selector]);
}

