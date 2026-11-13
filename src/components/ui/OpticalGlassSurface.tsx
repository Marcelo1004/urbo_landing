import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export interface OpticalGlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'high';
  interactive?: boolean;
  specular?: boolean;
  chromaticFringe?: boolean;
}

/**
 * URBO V5.5 — OpticalGlassSurface (Real Refraction & Physical Dispersion Prototype)
 * Evaluates SVG displacement mapping + Fresnel caustics + gradient hairline rim.
 * Automatically activates lightweight compositor fallback on mobile/touch to protect 60fps.
 */
export const OpticalGlassSurface: React.FC<OpticalGlassSurfaceProps> = ({
  children,
  className,
  intensity = 'medium',
  interactive = true,
  specular = true,
  chromaticFringe = true,
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    setIsMobile(isTouch);
  }, []);

  // Desktop only: Interactive tilt & dynamic cursor-driven specular angle
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMobile || !interactive) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.35, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.35, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Restrained tilt max +- 4 degrees
      const rotY = ((x - cx) / cx) * 4;
      const rotX = -((y - cy) / cy) * 4;

      xTo(rotY);
      yTo(rotX);

      // Pass coordinates for dynamic refractive glint
      el.style.setProperty('--glint-x', `${(x / rect.width) * 100}%`);
      el.style.setProperty('--glint-y', `${(y / rect.height) * 100}%`);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    };
  }, [interactive, isMobile]);

  // Refraction intensity mappings
  const displacementScale = intensity === 'high' ? 14 : intensity === 'medium' ? 8 : 4;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-3xl overflow-hidden glass-optical select-none transition-shadow duration-300',
        interactive && 'hover:shadow-[0_20px_50px_rgba(0,201,167,0.35)]',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        ...style,
      }}
      {...props}
    >
      {/* 1. Underlying Optical Refraction SVG Filter (Desktop only to prevent mobile GPU stalls) */}
      {!isMobile && (
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
          <filter id="urbo-optical-refraction" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.06"
              numOctaves="2"
              result="lensNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lensNoise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.3" result="smoothRefraction" />
          </filter>
        </svg>
      )}

      {/* 2. Chromatic Dispersion Fringe at Rim (Cyan + Violet Caustic Boundary) */}
      {chromaticFringe && !isMobile && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-10"
          style={{
            background:
              'radial-gradient(ellipse at var(--glint-x, 50%) var(--glint-y, 20%), rgba(0, 229, 190, 0.18) 0%, rgba(166, 255, 0, 0.08) 45%, transparent 70%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* 3. Fresnel Specular Beveled Highlight at Grazing Polar Edge */}
      {specular && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none z-20"
        />
      )}

      {/* 4. Active Specular Shimmer Sweep */}
      <div
        ref={sheenRef}
        aria-hidden="true"
        className="absolute -inset-y-12 w-28 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-22deg] pointer-events-none z-10"
      />

      {/* 5. Protected Content Slot */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  );
};

