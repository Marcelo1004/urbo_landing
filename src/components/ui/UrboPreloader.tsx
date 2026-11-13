import React, { useEffect, useRef, useState } from 'react';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { useIntroSequence } from '@/motion/useIntroSequence';
import { gsap } from 'gsap';

export const UrboPreloader: React.FC = () => {
  const { phase, setPhase, progress, statusText } = useIntroSequence();

  const preloaderRef = useRef<HTMLDivElement>(null);
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
  const progressAnimRef = useRef<{ value: number }>({ value: 10 });

  // Initial Entrance Animation for Preloader Elements
  useEffect(() => {
    if (phase === 'complete') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Stage 1 — Logo Appearance with Optical Blur Reveal
      tl.fromTo(
        logoWrapperRef.current,
        { scale: 0.88, y: 12, opacity: 0, filter: 'blur(8px)' },
        { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }
      );

      // Stage 2 — Glowing Aura Ring Expansion
      tl.fromTo(
        glowRingRef.current,
        { opacity: 0, scale: 0.75 },
        { opacity: 0.8, scale: 1.25, duration: 0.65, ease: 'sine.out' },
        '-=0.35'
      );

      // Stage 3 — Specular Sheen Sweep on Logo
      tl.fromTo(
        sheenRef.current,
        { x: '-150%', opacity: 0 },
        { x: '250%', opacity: 0.9, duration: 0.7, ease: 'power2.inOut' },
        '-=0.45'
      );

      // Stage 4 — Brand Typography & Liquid Glass Progress Bar Entrance (enters at 0.22s)
      tl.fromTo(
        [textLabelRef.current, barContainerRef.current],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
        0.22
      );

      // Continuous ambient sheen on the Liquid Glass progress bar
      if (barSheenRef.current) {
        gsap.fromTo(
          barSheenRef.current,
          { x: '-120%', opacity: 0 },
          { x: '350%', opacity: 0.8, duration: 1.4, repeat: -1, repeatDelay: 0.6, ease: 'power2.inOut' }
        );
      }

      // Continuous gentle breathing of the logo aura
      if (glowRingRef.current) {
        gsap.to(glowRingRef.current, {
          scale: 1.35,
          opacity: 0.6,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, preloaderRef);

    return () => ctx.revert();
  }, []);

  // Smoothly interpolate progress whenever context updates it
  useEffect(() => {
    if (phase === 'complete') return;

    gsap.to(progressAnimRef.current, {
      value: progress,
      duration: 0.28,
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

  // Orchestrated Exit Sequence: Handshake to Hero Timeline
  useEffect(() => {
    if (phase !== 'ready') return;
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    const exitTl = gsap.timeline();

    // 1. Specular Flash on the completed Liquid Glass bar & Logo
    exitTl
      .to(logoWrapperRef.current, {
        scale: 1.03,
        filter: 'drop-shadow(0 0 22px rgba(0, 229, 190, 0.9))',
        duration: 0.12,
        ease: 'power2.out',
      })
      // 2. Preloader content gently ascends and dissolves
      .to(
        [logoWrapperRef.current, barContainerRef.current, textLabelRef.current],
        {
          y: -12,
          opacity: 0,
          scale: 0.97,
          duration: 0.18,
          ease: 'power2.in',
        },
        '+=0.02'
      )
      // 3. Dark curtain sweeps upwards uncovering the Hero swiftly (0.36s)
      .to(
        preloaderRef.current,
        {
          yPercent: -100,
          duration: 0.36,
          ease: 'power3.inOut',
          onStart: () => {
            // Trigger Hero GSAP reveal timeline with optimal offset so it unfolds in full view!
            setTimeout(() => {
              setPhase('revealing');
            }, 60);
          },
          onComplete: () => {
            setPhase('complete');
          },
        },
        '-=0.05'
      );
  }, [phase, setPhase]);

  if (phase === 'complete') return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070B14] select-none pointer-events-auto overflow-hidden min-h-[100dvh]"
      aria-label="Cargando URBO"
      role="status"
    >
      {/* Ambient background volumetric glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-urbo-teal/15 blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-[320px] h-[320px] rounded-full bg-radioactive/10 blur-[130px] pointer-events-none"
      />

      {/* Main Protagonist Capsule */}
      <div className="relative flex flex-col items-center z-10 px-4">
        {/* Glowing Aura Ring */}
        <div
          ref={glowRingRef}
          className="absolute -inset-8 rounded-full bg-gradient-to-r from-urbo-teal/30 via-cyan-400/20 to-radioactive/20 blur-2xl opacity-0 pointer-events-none"
        />

        {/* Logo Container with Optical Glass Surface */}
        <div
          ref={logoWrapperRef}
          className="relative rounded-3xl p-3.5 optical-glass-surface border border-urbo-teal/40 shadow-[0_0_42px_rgba(0,201,167,0.35)] overflow-hidden flex items-center justify-center bg-slate-950/70 backdrop-blur-xl"
        >
          {/* Specular Diagonal Sheen Sweep */}
          <div
            ref={sheenRef}
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none"
          />

          <UrboLogo size={78} className="!bg-transparent !border-none !shadow-none" />
        </div>

        {/* Minimalist Tech Typography Brand */}
        <div ref={textLabelRef} className="mt-5 text-center">
          <div className="font-tech text-2xl sm:text-3xl font-black tracking-[0.25em] text-white uppercase">
            URBO
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-urbo-teal2 uppercase mt-1">
            MOVILIDAD EN TIEMPO REAL · SCZ
          </div>
        </div>

        {/* =================================================================
            AUTHENTIC LIQUID GLASS PROGRESS BAR
            ================================================================= */}
        <div ref={barContainerRef} className="mt-6 flex flex-col items-center w-full max-w-[280px] sm:max-w-[340px]">
          {/* Top Status & Monospace Percentage Header */}
          <div className="w-full flex items-center justify-between mb-2 text-[10px] font-mono tracking-wider">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-urbo-teal animate-pulse" />
              <span className="truncate max-w-[190px] sm:max-w-[230px]">{statusText}</span>
            </div>
            <span ref={percentTextRef} className="text-urbo-teal2 font-bold font-mono text-xs">
              {displayPercent}%
            </span>
          </div>

          {/* Liquid Glass Pill Container */}
          <div className="relative w-full h-3.5 rounded-full optical-glass-surface border border-white/20 border-t-white/40 border-b-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.35)] overflow-hidden bg-slate-950/80 backdrop-blur-xl p-[2px]">
            {/* Top Internal Glass Specular Highlight */}
            <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

            {/* Active Liquid Fill */}
            <div
              ref={liquidFillRef}
              className="h-full rounded-full bg-gradient-to-r from-urbo-teal/85 via-urbo-teal2 to-radioactive-bright relative overflow-hidden transition-all shadow-[0_0_14px_rgba(0,229,190,0.6)]"
              style={{ width: `${displayPercent}%` }}
            >
              {/* Internal Moving Specular Beam */}
              <div
                ref={barSheenRef}
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/55 to-transparent skew-x-[-25deg] pointer-events-none"
              />

              {/* Leading Edge Light Bead */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#00E5BE]" />
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
