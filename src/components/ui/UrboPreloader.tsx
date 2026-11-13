import React, { useEffect, useRef, useState } from 'react';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { useIntroSequence } from '@/motion/useIntroSequence';
import { motion } from '@/motion/motionTokens';
import { gsap } from 'gsap';

export const UrboPreloader: React.FC = () => {
  const { phase, setPhase, progress, statusText } = useIntroSequence();

  const preloaderRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  const liquidFillRef = useRef<HTMLDivElement>(null);
  const barSheenRef = useRef<HTMLDivElement>(null);
  const textLabelRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);

  const [displayPercent, setDisplayPercent] = useState<number>(progress);
  const hasExitedRef = useRef<boolean>(false);
  const progressAnimRef = useRef<{ value: number }>({ value: 15 });

  // Initial Entrance Animation for Preloader Elements
  useEffect(() => {
    if (phase === 'complete') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Stage 1 — Logo Appearance with smooth scale & opacity
      tl.fromTo(
        logoWrapperRef.current,
        { scale: 0.92, y: 10, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: motion.duration.normal, ease: motion.ease.enter }
      );

      // Stage 2 — Glowing Aura Ring Expansion
      tl.fromTo(
        glowRingRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 0.75, scale: 1.2, duration: 0.55, ease: 'sine.out' },
        '-=0.3'
      );

      // Stage 3 — Specular Sheen Sweep on Logo
      tl.fromTo(
        sheenRef.current,
        { x: '-150%', opacity: 0 },
        { x: '250%', opacity: 0.85, duration: 0.6, ease: motion.ease.transition },
        '-=0.35'
      );

      // Stage 4 — Brand Typography & Liquid Glass Progress Bar Entrance
      tl.fromTo(
        [textLabelRef.current, barContainerRef.current],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: motion.duration.fast, stagger: 0.06, ease: motion.ease.enter },
        0.2
      );

      // Ambient sheen on the Liquid Glass progress bar
      if (barSheenRef.current) {
        gsap.fromTo(
          barSheenRef.current,
          { x: '-120%', opacity: 0 },
          { x: '350%', opacity: 0.75, duration: 1.4, repeat: -1, repeatDelay: 0.5, ease: 'power2.inOut' }
        );
      }
    }, preloaderRef);

    return () => ctx.revert();
  }, []);

  // Smoothly interpolate progress number and bar fill
  useEffect(() => {
    if (phase === 'complete' || phase === 'exiting' || phase === 'heroEntering') return;

    gsap.to(progressAnimRef.current, {
      value: progress,
      duration: 0.25,
      ease: 'power2.out',
      onUpdate: () => {
        const rounded = Math.round(progressAnimRef.current.value);
        setDisplayPercent(rounded);
        if (liquidFillRef.current) {
          liquidFillRef.current.style.width = `${rounded}%`;
        }
      },
    });
  }, [progress, phase]);

  // =========================================================================
  // LIQUID GLASS DISSOLVE SEQUENCE (No Dropdown, No Curtain Slide)
  // Single coordinated orchestrator executing once
  // =========================================================================
  useEffect(() => {
    if (phase !== 'ready') return;
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    const exitTl = gsap.timeline();

    // 1. Reflejo atraviesa la barra y el logo (specular sweep at 100%)
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
      .fromTo(
        barSheenRef.current,
        { x: '-100%', opacity: 0 },
        { x: '320%', opacity: 1, duration: motion.duration.fast, ease: motion.ease.transition },
        0.04
      )
      // 2. El contenido del preloader se desvanece suavemente
      .to(
        contentWrapperRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.98,
          duration: motion.duration.fast,
          ease: motion.ease.exit,
          onStart: () => {
            setPhase('exiting');
          },
        },
        '+=0.06'
      )
      // 3. La superficie de Liquid Glass del preloader se disuelve (Crossfade Dissolve)
      //    Absolutamente NINGÚN dropdown ni cortina vertical.
      .to(
        preloaderRef.current,
        {
          opacity: 0,
          scale: 1.01,
          duration: 0.42,
          ease: motion.ease.exit,
          onStart: () => {
            // Handshake exacto: el fondo y el Hero comienzan su entrada
            // mientras la superficie de vidrio aún se está disolviendo
            setTimeout(() => {
              setPhase('heroEntering');
            }, 60);
          },
          onComplete: () => {
            setPhase('complete');
          },
        },
        '-=0.12'
      );
  }, [phase, setPhase]);

  if (phase === 'complete') return null;

  const isTransitioning = phase === 'exiting' || phase === 'heroEntering';

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070B14] select-none overflow-hidden min-h-[100dvh] will-change-[opacity,transform]"
      style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
      aria-label="Cargando URBO"
      role="status"
    >
      {/* Ambient background volumetric glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-urbo-teal/15 blur-[150px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-[280px] h-[280px] rounded-full bg-radioactive/10 blur-[120px] pointer-events-none"
      />

      {/* Main Protagonist Capsule Wrapper */}
      <div ref={contentWrapperRef} className="relative flex flex-col items-center z-10 px-4 will-change-[opacity,transform]">
        {/* Glowing Aura Ring */}
        <div
          ref={glowRingRef}
          className="absolute -inset-8 rounded-full bg-gradient-to-r from-urbo-teal/30 via-cyan-400/20 to-radioactive/20 blur-2xl opacity-0 pointer-events-none"
        />

        {/* Logo Container with MotionSites Liquid Glass Lens Capsule */}
        <div
          ref={logoWrapperRef}
          className="relative rounded-3xl p-4 sm:p-5 ms-liquid-glass ms-liquid-glass--strong shadow-[0_0_50px_rgba(0,201,167,0.35)] overflow-hidden flex items-center justify-center bg-slate-950/75 backdrop-blur-2xl"
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
            MOTIONSITES LIQUID GLASS PROGRESS BAR
            ================================================================= */}
        <div ref={barContainerRef} className="mt-7 flex flex-col items-center w-full max-w-[300px] sm:max-w-[380px]">
          {/* Top Status & Monospace Percentage Header */}
          <div className="w-full flex items-center justify-between mb-2.5 text-[11px] font-mono tracking-wider">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-urbo-teal animate-pulse shadow-[0_0_8px_#00E5BE]" />
              <span className="truncate max-w-[210px] sm:max-w-[270px] text-slate-200 font-medium">{statusText}</span>
            </div>
            <span ref={percentTextRef} className="text-urbo-teal2 font-bold font-mono text-xs">
              {displayPercent}%
            </span>
          </div>

          {/* Liquid Glass Pill Container */}
          <div className="relative w-full h-4 rounded-full ms-liquid-glass overflow-hidden bg-slate-950/80 backdrop-blur-xl p-[2.5px] shadow-[0_6px_25px_rgba(0,0,0,0.8)]">
            {/* Top Internal Glass Specular Highlight */}
            <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none z-20" />

            {/* Active Liquid Fill */}
            <div
              ref={liquidFillRef}
              className="h-full rounded-full bg-gradient-to-r from-urbo-teal via-cyan-400 to-[#A6FF00] relative overflow-hidden transition-all shadow-[0_0_18px_rgba(0,229,190,0.7)]"
              style={{ width: `${displayPercent}%` }}
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
        TELEMETRÍA DIGITAL · GPS ACTIVO
      </div>
    </div>
  );
};
