import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionOptions {
  triggerRef: RefObject<HTMLElement | null>;
  contentRef?: RefObject<HTMLElement | null>;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useSectionTransitions({
  triggerRef,
  contentRef,
}: SectionTransitionOptions) {
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Subtle ambient depth and lighting transition on scroll
      gsap.fromTo(
        trigger,
        { '--ambient-intensity': 0.6 },
        {
          '--ambient-intensity': 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: trigger,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.6,
          },
        }
      );
    }, trigger);

    return () => ctx.revert();
  }, [triggerRef, contentRef]);
}

