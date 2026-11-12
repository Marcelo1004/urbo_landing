import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';

export function useAmbientMotion(
  targetRef: RefObject<HTMLElement | null>,
  options: {
    float?: boolean;
    shimmer?: boolean;
    distance?: number;
    duration?: number;
  } = {}
) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const float = options.float ?? true;
    const distance = options.distance ?? 4;
    const duration = options.duration ?? 4.5;

    let tl: gsap.core.Timeline | null = null;

    // Use IntersectionObserver to stop animation when element is offscreen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!tl) {
            tl = gsap.timeline({ repeat: -1, yoyo: true });
            if (float) {
              tl.to(el, {
                y: `-=${distance}`,
                duration: duration,
                ease: 'sine.inOut',
              });
            }
          } else {
            tl.resume();
          }
        } else {
          tl?.pause();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(el);

    return () => {
      observer.disconnect();
      tl?.kill();
    };
  }, [targetRef, options.float, options.distance, options.duration]);
}

