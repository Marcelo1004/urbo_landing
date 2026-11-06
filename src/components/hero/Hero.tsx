import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Volume2, Navigation, Compass, Sparkles, MapPin } from 'lucide-react';
import { GlassSurface, GlassBadge, GlassButton } from '@/components/ui/Glass';
import { CascoViejoMap } from '@/components/map/CascoViejoMap';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export const Hero: React.FC = () => {
  const [activeBus, setActiveBus] = useState<'32' | '58'>('32');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const mapColRef = useRef<HTMLDivElement>(null);

  const triggerVoiceDemo = () => {
    setIsPlayingVoice(true);
    setTimeout(() => setIsPlayingVoice(false), 2400);
  };

  // Cinematic GSAP Entrance Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, delay: 0.2 })
        .from('.hero-headline', { y: 30, opacity: 0, duration: 0.9 }, '-=0.5')
        .from('.hero-subhead', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
        .from('.hero-metrics', { y: 20, opacity: 0, duration: 0.7 }, '-=0.4')
        .from(mapColRef.current, { scale: 0.95, opacity: 0, duration: 1.1, ease: 'power2.out' }, '-=0.8');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[720px] lg:min-h-[820px] pt-28 sm:pt-36 pb-16 lg:pb-24 flex items-center justify-center overflow-hidden scz-transit-grid"
    >
      {/* Ambient Lighting Orbs */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-urbo-teal/15 blur-[170px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-32 w-[500px] h-[500px] rounded-full bg-urbo-amber/10 blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-slate-900/50 blur-[130px] pointer-events-none"
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

            {/* Main Headline */}
            <h1 className="hero-headline text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-white mb-6">
              Tu micro.<br className="sm:hidden" />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
                En tiempo real.
              </span>
            </h1>

            {/* Subtitle / Truth */}
            <p className="hero-subhead text-sm sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal">
              La primera plataforma de transporte público con GPS en vivo, aviso por voz
              manos libres para el chofer y tiempos exactos de llegada para Santa Cruz de la Sierra.
            </p>

            {/* Apple Pill Actions */}
            <div className="hero-buttons flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <a
                href="#solucion"
                className="apple-pill-primary px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-base flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto text-slate-950 font-bold"
              >
                <span>Explorar la tecnología</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <a
                href="#audiencias"
                className="apple-pill-secondary px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>Soy Chofer / Línea</span>
              </a>
            </div>

            {/* Telemetry Baseline Proof Bar */}
            <div className="hero-metrics pt-6 border-t border-white/10 w-full max-w-xl">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-left">
                <div>
                  <div className="text-sm sm:text-xl font-bold font-mono text-white">5 meses</div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                    En calle
                  </div>
                </div>
                <div>
                  <div className="text-sm sm:text-xl font-bold font-mono text-urbo-teal2">140</div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                    Pilotos
                  </div>
                </div>
                <div>
                  <div className="text-sm sm:text-xl font-bold font-mono text-urbo-amber">Línea 30</div>
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
            <div className="w-full max-w-[460px] aspect-[4/5] rounded-[36px] p-2 sm:p-2.5 liquid-glass-surface border-white/20 shadow-glass-edge relative">
              
              {/* Vehicle Selector Pills Floating Bar */}
              <div className="absolute top-5 right-5 z-20 flex items-center bg-slate-950/80 border border-white/15 rounded-full p-1 backdrop-blur-xl shadow-lg">
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

              {/* The Real Interactive MapLibre GL Map */}
              <CascoViejoMap activeBus={activeBus} onBusSelect={setActiveBus} />

              {/* Hands-Free Voice Alert Demo Pill (Interactive Test Button) */}
              <div
                onClick={triggerVoiceDemo}
                className="absolute top-16 left-5 z-20 cursor-pointer select-none max-w-[260px] liquid-glass-amber p-2.5 rounded-2xl border-urbo-amber/40 shadow-lg hover:border-urbo-amber transition-all"
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
                <div className="text-[11px] font-semibold text-white leading-tight">
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
