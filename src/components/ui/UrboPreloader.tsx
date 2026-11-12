import React, { useEffect, useRef, useState } from 'react';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { useIntroSequence } from '@/motion/useIntroSequence';
import { gsap } from 'gsap';

export const UrboPreloader: React.FC = () => {
  const { phase, setPhase } = useIntroSequence();
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const activityBarRef = useRef<HTMLDivElement>(null);
  const textLabelRef = useRef<HTMLDivElement>(null);

  const [mountedTime] = useState<number>(() => Date.now());

  useEffect(() => {
    if (phase === 'complete') return;

    const preloaderEl = preloaderRef.current;
    if (!preloaderEl) return;

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase('complete');
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Stage 1 — Logo Appearance
      tl.fromTo(
        logoWrapperRef.current,
        { scale: 0.85, y: 18, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      );

      // Stage 2 — Specular Sheen Sweep & Glowing Aura
      tl.fromTo(
        glowRingRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 0.85, scale: 1.25, duration: 0.9, ease: 'sine.out' },
        '-=0.4'
      );

      tl.fromTo(
        sheenRef.current,
        { x: '-150%', opacity: 0 },
        { x: '250%', opacity: 0.9, duration: 0.85, ease: 'power2.inOut' },
        '-=0.6'
      );

      tl.fromTo(
        [textLabelRef.current, activityBarRef.current],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.3'
      );
    }, preloaderRef);

    // Stage 3 — Critical Resource Preparation (Real Document & Fonts Check)
    let isCancelled = false;
    const safetyTimeout = setTimeout(() => {
      finishPreloader();
    }, 1800);

    const checkCriticalResources = async () => {
      try {
        if (document.fonts) {
          await Promise.race([
            document.fonts.ready,
            new Promise((r) => setTimeout(r, 500))
          ]);
        }
      } catch (e) {
        // Fallback gracefully
      }

      const elapsed = Date.now() - mountedTime;
      const minDisplayTime = 800; // Optimal perception of the cinematic intro
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        if (!isCancelled) {
          finishPreloader();
        }
      }, remainingTime);
    };

    const finishPreloader = () => {
      clearTimeout(safetyTimeout);
      setPhase('ready');

      if (!preloaderRef.current) {
        setPhase('complete');
        return;
      }

      const finishTl = gsap.timeline({
        onStart: () => {
          setPhase('revealing');
        },
        onComplete: () => {
          setPhase('complete');
        },
      });

      // Stage 4 — Finalization & Pulse Flash (Fast, punchy & seamless)
      finishTl
        .to(activityBarRef.current, {
          scaleX: 1,
          opacity: 1,
          duration: 0.2,
          ease: 'power3.inOut',
        })
        .to(
          logoWrapperRef.current,
          {
            scale: 1.05,
            filter: 'drop-shadow(0 0 25px rgba(0, 229, 190, 0.9))',
            duration: 0.2,
            ease: 'power2.out',
          },
          '-=0.1'
        )
        // Stage 5 — Curtain Transition to Hero
        .to(
          logoWrapperRef.current,
          {
            y: -25,
            opacity: 0,
            scale: 0.95,
            duration: 0.25,
            ease: 'power3.in',
          },
          '+=0.05'
        )
        .to(
          preloaderRef.current,
          {
            yPercent: -100,
            duration: 0.5,
            ease: 'power4.inOut',
          },
          '-=0.2'
        );
    };

    checkCriticalResources();

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimeout);
      ctx.revert();
    };
  }, []);

  if (phase === 'complete') return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070B14] select-none pointer-events-auto overflow-hidden"
      aria-label="Cargando URBO"
      role="status"
    >
      {/* Ambient background volumetric glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-urbo-teal/15 blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-radioactive/10 blur-[130px] pointer-events-none"
      />

      {/* Main Protagonist Logo Capsule */}
      <div className="relative flex flex-col items-center z-10">
        
        {/* Glowing Aura Ring */}
        <div
          ref={glowRingRef}
          className="absolute -inset-8 rounded-full bg-gradient-to-r from-urbo-teal/30 via-cyan-400/20 to-radioactive/20 blur-2xl opacity-0 pointer-events-none"
        />

        {/* Logo Container */}
        <div
          ref={logoWrapperRef}
          className="relative rounded-3xl p-3 optical-glass-surface border border-urbo-teal/40 shadow-[0_0_40px_rgba(0,201,167,0.35)] overflow-hidden flex items-center justify-center"
        >
          {/* Specular Diagonal Sheen Sweep */}
          <div
            ref={sheenRef}
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none"
          />

          <UrboLogo size={76} className="!bg-transparent !border-none !shadow-none" />
        </div>

        {/* Minimalist Tech Typography Brand */}
        <div ref={textLabelRef} className="mt-5 text-center">
          <div className="font-tech text-2xl font-black tracking-[0.25em] text-white uppercase">
            URBO
          </div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-urbo-teal2 uppercase mt-1">
            MOVILIDAD EN TIEMPO REAL · SCZ
          </div>
        </div>

        {/* Minimalist Activity Bar (No Fake Percentage) */}
        <div className="mt-6 w-44 sm:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            ref={activityBarRef}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-urbo-teal2 to-radioactive-bright rounded-full animate-pulse"
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>

      {/* Discreet bottom latency note */}
      <div className="absolute bottom-6 text-[10px] font-mono text-slate-500 tracking-wider uppercase">
        TELEMETRÍA DIGITAL · GPS ACTIVO
      </div>
    </div>
  );
};
