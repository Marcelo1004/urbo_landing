import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Volume2, Navigation, Compass, Sparkles, MapPin } from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { CascoViejoMap } from '@/components/map/CascoViejoMap';
import { useIntroSequence } from '@/motion/useIntroSequence';
import { motion } from '@/motion/motionTokens';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export const Hero: React.FC = () => {
  const { phase, setMapReady } = useIntroSequence();
  const [activeBus, setActiveBus] = useState<'32' | '58'>('32');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const mapColRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);
  const hasAnimatedRef = useRef(false);
  const ctxRef = useRef<gsap.Context | null>(null);

  const triggerVoiceDemo = () => {
    setIsPlayingVoice(true);
    setTimeout(() => setIsPlayingVoice(false), 2400);
  };

  // Cleanup GSAP context only on component unmount
  useEffect(() => {
    return () => {
      ctxRef.current?.revert();
    };
  }, []);

  // Cinematic GSAP Entrance Timeline synchronized with Preloader Sequence
  useEffect(() => {
    if (!heroRef.current) return;

    // Phase 1: Keep Hero pristine & zero flash during initial preloader display
    if (phase === 'loading' || phase === 'ready' || phase === 'exiting') {
      if (!hasAnimatedRef.current) {
        gsap.set(
          [
            '.hero-ambient-glow',
            '.hero-badge',
            '.hero-line-1',
            '.hero-line-2',
            '.hero-subhead',
            '.hero-buttons a',
            '.hero-metrics-item',
            mapColRef.current,
            '.hero-map-overlay',
          ],
          { opacity: 0 }
        );
      }
      return;
    }

    // Phase 2: Orchestrated Cinematic Entrance when Preloader dissolves into Hero
    if ((phase === 'heroEntering' || phase === 'complete') && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      ctxRef.current = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: motion.ease.enter } });

        // Stage 1: Ambient Halos & glowing dust
        tl.fromTo(
          '.hero-ambient-glow',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.65, ease: 'sine.out' },
          0
        )
        // Stage 2: Hero Location Badge
          .fromTo(
            '.hero-badge',
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45 },
            0.08
          )
        // Stage 3 & 4: Headline Reveal (Restrained displacement 24-28px, pure composite)
          .fromTo(
            '.hero-line-1',
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55 },
            0.16
          )
          .fromTo(
            '.hero-line-2',
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.58 },
            0.24
          )
        // Stage 5: Subtitle & Call-to-actions
          .fromTo(
            '.hero-subhead',
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45 },
            0.34
          )
          .fromTo(
            '.hero-buttons a',
            { y: 16, opacity: 0, scale: 0.98 },
            { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.42, ease: motion.ease.enter },
            0.42
          )
        // Stage 6: Telemetry baseline bar (5 meses / 140 / Línea 30)
          .fromTo(
            '.hero-metrics-item',
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.06, duration: 0.42, ease: motion.ease.enter },
            0.50
          )
        // Stage 7: Cockpit Map HUD entrance (depth lift & scale)
          .fromTo(
            mapColRef.current,
            { scale: 0.97, y: 22, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.65, ease: motion.ease.enter },
            0.28
          )
          .fromTo(
            '.hero-map-overlay',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, stagger: 0.06, duration: 0.42, ease: motion.ease.enter },
            0.55
          )
        // Stage 8: Specular light beam sweep across the glass cockpit
          .fromTo(
            '.cockpit-specular-sweep',
            { x: '-120%', opacity: 0 },
            { x: '220%', opacity: 0.7, duration: 0.75, ease: motion.ease.transition },
            0.65
          );

        // Magnetic hover on primary action button (Desktop mouse only)
        const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
        const btn = primaryBtnRef.current;
        if (btn && !isTouch) {
          const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power2.out' });
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power2.out' });

          const handleBtnMouseMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
            xTo(x);
            yTo(y);
          };

          const handleBtnMouseLeave = () => {
            xTo(0);
            yTo(0);
          };

          btn.addEventListener('mousemove', handleBtnMouseMove);
          btn.addEventListener('mouseleave', handleBtnMouseLeave);

          return () => {
            btn.removeEventListener('mousemove', handleBtnMouseMove);
            btn.removeEventListener('mouseleave', handleBtnMouseLeave);
            gsap.set(btn, { x: 0, y: 0 });
          };
        }
      }, heroRef);
    }
  }, [phase]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[720px] lg:min-h-[820px] pt-28 sm:pt-36 pb-16 lg:pb-24 flex items-center justify-center overflow-hidden scz-transit-grid"
    >
      {/* Ambient Lighting Orbs with continuous gentle breathing */}
      <div
        aria-hidden="true"
        className="hero-ambient-glow absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-urbo-teal/15 blur-[170px] pointer-events-none animate-pulse-subtle"
      />
      <div
        aria-hidden="true"
        className="hero-ambient-glow absolute -bottom-24 -left-32 w-[500px] h-[500px] rounded-full bg-radioactive/15 blur-[160px] pointer-events-none animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="hero-ambient-glow absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-slate-900/50 blur-[130px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* =================================================================
              LEFT: EDITORIAL HEADLINE & VALUE PROPOSITION
              ================================================================= */}
          <div ref={textColRef} className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Live Pilot Location Badge */}
            <div className="hero-badge mb-6">
              <GlassBadge variant="teal" pulse>
                CASCO VIEJO · SANTA CRUZ DE LA SIERRA
              </GlassBadge>
            </div>

            {/* Main Headline (Multi-line masked cinematic entrance) */}
            <h1 className="hero-headline text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-white mb-6">
              <span className="hero-line-1-wrap overflow-hidden block">
                <span className="hero-line-1 block">Tu micro.</span>
              </span>
              <span className="hero-line-2-wrap overflow-hidden block mt-1">
                <span className="hero-line-2 block text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
                  En tiempo real.
                </span>
              </span>
            </h1>

            {/* Subtitle / Truth (Updated Copy: "tiempos de llegada") */}
            <p className="hero-subhead text-sm sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal">
              La primera plataforma de transporte público con GPS en vivo, aviso por voz
              manos libres para el chofer y tiempos de llegada para Santa Cruz de la Sierra.
            </p>

            {/* MotionSites High-Craft Buttons */}
            <div className="hero-buttons flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <a
                ref={primaryBtnRef}
                href="#solucion"
                className="ms-btn-chrome rounded-full px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-base flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto"
              >
                <span>Explorar la tecnología</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <a
                href="#audiencias"
                className="ms-btn-halo rounded-full px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>Soy Chofer / Línea</span>
              </a>
            </div>

            {/* Telemetry Baseline Proof Bar */}
            <div className="hero-metrics pt-6 border-t border-white/10 w-full max-w-xl">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-left">
                <div className="hero-metrics-item">
                  <div className="text-base sm:text-2xl font-black font-tech tracking-wider text-white">5 meses</div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                    En calle
                  </div>
                </div>
                <div className="hero-metrics-item">
                  <div className="text-base sm:text-2xl font-black font-tech tracking-wider text-urbo-teal2">140</div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                    Pilotos
                  </div>
                </div>
                <div className="hero-metrics-item">
                  <div className="text-base sm:text-2xl font-black font-tech tracking-wider text-urbo-amber">Línea 30</div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                    SCZ Norte
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* =================================================================
              RIGHT: REAL CARTOGRAPHIC MAP COCKPIT (CASCO VIEJO SANTA CRUZ)
              ================================================================= */}
          <div ref={mapColRef} className="lg:col-span-5 relative w-full flex flex-col items-center">
            
            {/* Real Map Canvas Container with Floating Liquid Glass Controls */}
            <div className="w-full max-w-[460px] aspect-[4/5] rounded-[36px] p-2 sm:p-2.5 ms-liquid-glass ms-liquid-glass--strong shadow-glass-volumetric relative overflow-hidden">
              
              {/* Specular Light Sweep Overlay */}
              <div
                aria-hidden="true"
                className="cockpit-specular-sweep pointer-events-none absolute -inset-y-12 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] z-30"
              />
              
              {/* Vehicle Selector Pills Floating Bar */}
              <div className="hero-map-overlay absolute top-5 right-5 z-20 flex items-center bg-slate-950/80 border border-white/15 rounded-full p-1 backdrop-blur-xl shadow-lg">
                <button
                  type="button"
                  onClick={() => setActiveBus('32')}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-mono font-bold transition-all',
                    activeBus === '32'
                      ? 'bg-urbo-teal text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  INT 32
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBus('58')}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-mono font-bold transition-all',
                    activeBus === '58'
                      ? 'bg-urbo-teal text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  INT 58
                </button>
              </div>

              {/* The Real Interactive MapLibre GL Map with Smart Load Handshake */}
              <CascoViejoMap
                activeBus={activeBus}
                onBusSelect={setActiveBus}
                onMapReady={() => setMapReady(true)}
              />

              {/* Hands-Free Voice Alert Demo Pill (Interactive Test Button) */}
              <div
                onClick={triggerVoiceDemo}
                className="hero-map-overlay absolute top-16 left-5 z-20 cursor-pointer select-none max-w-[260px] liquid-glass-amber p-2.5 rounded-2xl border-urbo-amber/40 shadow-lg hover:border-urbo-amber transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-urbo-amber font-bold uppercase">
                    <Volume2 className={cn('w-3.5 h-3.5', isPlayingVoice && 'animate-bounce')} />
                    <span>AVISO POR VOZ A 300M</span>
                  </div>
                  {/* Wave bar animation */}
                  <div className="flex items-center gap-0.5 h-2.5">
                    <span className={cn('w-0.5 bg-urbo-amber rounded-full', isPlayingVoice ? 'audio-bar-1' : 'h-1')} />
                    <span className={cn('w-0.5 bg-urbo-amber rounded-full', isPlayingVoice ? 'audio-bar-2' : 'h-2')} />
                    <span className={cn('w-0.5 bg-urbo-amber rounded-full', isPlayingVoice ? 'audio-bar-3' : 'h-1.5')} />
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-slate-900 dark:text-white leading-tight">
                  &ldquo;Pasajero esperando, mano derecha.&rdquo;
                </div>
                <div className="text-[9px] text-urbo-amber font-mono mt-1">
                  Toca para reproducir demo
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
