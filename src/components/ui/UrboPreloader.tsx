import React, { useEffect, useRef } from 'react';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { useIntroSequence } from '@/motion/useIntroSequence';
import { motion } from '@/motion/motionTokens';
import { gsap } from 'gsap';

export const UrboPreloader: React.FC = () => {
  const { phase, setPhase, statusText } = useIntroSequence();

  const preloaderRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  const liquidFillRef = useRef<HTMLDivElement>(null);
  const barSheenRef = useRef<HTMLDivElement>(null);
  const textLabelRef = useRef<HTMLDivElement>(null);

  const hasExitedRef = useRef<boolean>(false);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Entrance & Indeterminate Activity Animation (No React state re-renders)
  useEffect(() => {
    if (phase === 'complete') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Logo entrance
      tl.fromTo(
        logoWrapperRef.current,
        { scale: 0.92, y: 10, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: motion.duration.normal, ease: motion.ease.enter }
      );

      // 2. Specular sweep across logo
      tl.fromTo(
        sheenRef.current,
        { x: '-150%', opacity: 0 },
        { x: '250%', opacity: 0.85, duration: 0.55, ease: motion.ease.transition },
        '-=0.3'
      );

      // 3. Brand typography & progress bar container
      tl.fromTo(
        [textLabelRef.current, barContainerRef.current],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: motion.duration.fast, stagger: 0.05, ease: motion.ease.enter },
        0.18
      );

      // 4. Staged compositor-friendly progress progression via scaleX (Zero layout shifts, zero React state re-renders)
      if (liquidFillRef.current) {
        gsap.fromTo(
          liquidFillRef.current,
          { scaleX: 0.15 },
          { scaleX: 0.85, duration: 0.45, ease: 'power2.out' }
        );
      }

      // Continuous ambient sheen sweep on bar
      if (barSheenRef.current) {
        gsap.fromTo(
          barSheenRef.current,
          { x: '-120%', opacity: 0 },
          { x: '350%', opacity: 0.75, duration: 1.2, repeat: -1, repeatDelay: 0.4, ease: 'power2.inOut' }
        );
      }
    }, preloaderRef);

    return () => {
      ctxRef.current?.revert();
    };
  }, []);

  // Coordinated Exit Handshake when system reaches 'ready'
  useEffect(() => {
    if (phase !== 'ready') return;
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    const exitTl = gsap.timeline();

    // 1. Fill snaps cleanly to 100% via scaleX
    if (liquidFillRef.current) {
      exitTl.to(
        liquidFillRef.current,
        { scaleX: 1.0, duration: 0.12, ease: 'power2.out' },
        0
      );
    }

    // 2. Specular sweep on logo and completed bar
    exitTl
      .to(
        logoWrapperRef.current,
        {
          scale: 1.02,
          boxShadow: '0 0 35px rgba(0, 229, 190, 0.45)',
          duration: motion.duration.micro,
          ease: 'power2.out',
        },
        0
      )
      .fromTo(
        sheenRef.current,
        { x: '-120%', opacity: 0 },
        { x: '240%', opacity: 0.95, duration: motion.duration.fast, ease: motion.ease.transition },
        0
      )
      // 3. Preloader inner content fades out smoothly
      .to(
        contentWrapperRef.current,
        {
          opacity: 0,
          y: -8,
          scale: 0.98,
          duration: motion.duration.fast,
          ease: motion.ease.exit,
          onStart: () => {
            setPhase('exiting');
          },
        },
        '+=0.04'
      )
      // 4. Preloader Liquid Glass surface dissolves (pure composite crossfade)
      .to(
        preloaderRef.current,
        {
          opacity: 0,
          scale: 1.01,
          duration: 0.36,
          ease: motion.ease.exit,
          onStart: () => {
            // Handshake exacto: el Hero entra a través del vidrio translúcido
            setTimeout(() => {
              setPhase('heroEntering');
            }, 50);
          },
          onComplete: () => {
            setPhase('complete');
          },
        },
        '-=0.1'
      );
  }, [phase, setPhase]);

  if (phase === 'complete') return null;

  const isTransitioning = phase === 'exiting' || phase === 'heroEntering';

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070B14] select-none overflow-hidden min-h-[100dvh] will-change-[opacity,transform]"
      style={{
        pointerEvents: isTransitioning ? 'none' : 'auto',
        background: 'radial-gradient(circle at 50% 50%, #0B162C 0%, #070B14 70%)',
      }}
      aria-label="Cargando URBO"
      role="status"
    >
      {/* Main Protagonist Capsule Wrapper */}
      <div
        ref={contentWrapperRef}
        className="relative flex flex-col items-center z-10 px-4 will-change-[opacity,transform]"
      >
        {/* Logo Container with MotionSites Liquid Glass Lens Capsule */}
        <div
          ref={logoWrapperRef}
          className="relative rounded-3xl p-4 sm:p-5 ms-liquid-glass ms-liquid-glass--strong shadow-[0_0_45px_rgba(0,201,167,0.3)] overflow-hidden flex items-center justify-center bg-slate-950/80 backdrop-blur-xl"
        >
          {/* Specular Diagonal Sheen Sweep */}
          <div
            ref={sheenRef}
            className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none"
          />

          <UrboLogo size={88} className="!bg-transparent !border-none !shadow-none" />
        </div>

        {/* Minimalist Tech Typography Brand */}
        <div ref={textLabelRef} className="mt-6 text-center">
          <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-urbo-teal2 uppercase">
            MOVILIDAD METROPOLITANA · SCZ
          </div>
          <div className="font-tech text-3xl sm:text-4xl font-black tracking-[0.25em] text-white uppercase mt-1">
            URBO
          </div>
        </div>

        {/* =================================================================
            COMPOSITOR-FRIENDLY LIQUID GLASS ACTIVITY BAR
            ScaleX transform-origin left (Zero reflows, zero state re-renders)
            ================================================================= */}
        <div ref={barContainerRef} className="mt-7 flex flex-col items-center w-full max-w-[280px] sm:max-w-[340px]">
          {/* Top Status Label */}
          <div className="w-full flex items-center justify-between mb-2 text-[11px] font-mono tracking-wider">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-urbo-teal animate-pulse shadow-[0_0_8px_#00E5BE]" />
              <span className="truncate max-w-[210px] sm:max-w-[260px] text-slate-200 font-medium">
                {statusText}
              </span>
            </div>
            <span className="text-[10px] font-mono text-urbo-teal2 uppercase tracking-widest font-semibold">
              GPS ACTIVO
            </span>
          </div>

          {/* Liquid Glass Pill Track */}
          <div className="relative w-full h-3.5 rounded-full ms-liquid-glass overflow-hidden bg-slate-950/80 backdrop-blur-xl p-[2px] shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            {/* Top Internal Glass Specular Highlight */}
            <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none z-20" />

            {/* Hardware-Accelerated Liquid Fill (scaleX compositor transform) */}
            <div
              ref={liquidFillRef}
              className="w-full h-full rounded-full bg-gradient-to-r from-urbo-teal via-cyan-400 to-[#A6FF00] relative overflow-hidden shadow-[0_0_16px_rgba(0,229,190,0.7)] origin-left will-change-transform"
              style={{ transform: 'scaleX(0.15)', transformOrigin: 'left center' }}
            >
              {/* Internal Moving Specular Beam */}
              <div
                ref={barSheenRef}
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-25deg] pointer-events-none"
              />

              {/* Leading Edge Light Bead */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#00E5BE]" />
            </div>
          </div>
        </div>
      </div>

      {/* Discreet bottom telemetry notice */}
      <div className="absolute bottom-6 text-[10px] font-mono text-slate-500 tracking-wider uppercase">
        TELEMETRÍA DIGITAL · SISTEMA DE MOVILIDAD
      </div>
    </div>
  );
};
