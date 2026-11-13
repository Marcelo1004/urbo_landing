import { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';

export interface GlassHoverOptions {
  tiltFactor?: number;
  maxTilt?: number;
  lift?: number;
  highlightGlow?: string;
  disabled?: boolean;
}

export function useGlassHover<T extends HTMLElement = HTMLDivElement>(
  targetRef: RefObject<T | null>,
  options: GlassHoverOptions = {}
) {
  const {
    tiltFactor = 0.05,
    maxTilt = 7,
    lift = 4,
    disabled = false,
  } = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || disabled) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Zero-overhead on touch / mobile devices: no mouse listeners, no RAF, no quickTo
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;

    // Fast setters using quickTo
    const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.35, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.35, ease: 'power2.out' });
    const zTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotY = Math.min(Math.max(((x - centerX) / centerX) * maxTilt, -maxTilt), maxTilt);
      const rotX = Math.min(Math.max(-((y - centerY) / centerY) * maxTilt, -maxTilt), maxTilt);

      xTo(rotY);
      yTo(rotX);
      zTo(-lift);

      // Pass coordinates to CSS custom properties for specular reflections
      el.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      el.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      el.style.setProperty('--mouse-px', `${x}px`);
      el.style.setProperty('--mouse-py', `${y}px`);
      el.style.setProperty('--mouse-active', '1');
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      zTo(0);
      el.style.setProperty('--mouse-active', '0');
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { rotationX: 0, rotationY: 0, y: 0 });
    };
  }, [targetRef, tiltFactor, maxTilt, lift, disabled]);
}

