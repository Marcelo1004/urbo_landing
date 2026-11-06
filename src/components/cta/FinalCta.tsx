import React, { useState, useRef, useEffect } from 'react';
import { Mail, MessageCircle, MapPin, ArrowUpRight, Sparkles, ExternalLink, RefreshCw, Send } from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export const FinalCta: React.FC = () => {
  // 'brand' (State A) vs 'contact' (State B)
  const [activeView, setActiveView] = useState<'brand' | 'contact'>('brand');
  const [animating, setAnimating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const stateARef = useRef<HTMLDivElement>(null);
  const stateBRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const glowBurstRef = useRef<HTMLDivElement>(null);

  // 1. Interactive 3D Mouse Tilt Tracking (Physical Liquid Glass Object feel)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const xTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
    const yTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt max +- 6 degrees
      const rotY = ((x - centerX) / centerX) * 6;
      const rotX = -((y - centerY) / centerY) * 6;

      xTo(rotY);
      yTo(rotX);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 2. Elegant Content Morph Transition via GSAP (Crossfade, Blur, Shimmer, Stagger)
  const toggleView = () => {
    if (animating) return;
    setAnimating(true);

    const isGoingToContact = activeView === 'brand';
    const outgoing = isGoingToContact ? stateARef.current : stateBRef.current;
    const incoming = isGoingToContact ? stateBRef.current : stateARef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveView(isGoingToContact ? 'contact' : 'brand');
        setAnimating(false);
      },
    });

    // Momentary glow burst through glass
    if (glowBurstRef.current) {
      tl.to(glowBurstRef.current, {
        opacity: 0.8,
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
      }, 0);
    }

    // Glass Shimmer sweep across surface
    if (sheenRef.current) {
      tl.fromTo(
        sheenRef.current,
        { x: '-120%', opacity: 0 },
        { x: '180%', opacity: 0.8, duration: 0.65, ease: 'power2.inOut' },
        0
      );
    }

    // Outgoing content: fade, slight slide & blur
    if (outgoing) {
      tl.to(
        outgoing,
        {
          opacity: 0,
          y: isGoingToContact ? -12 : 12,
          filter: 'blur(8px)',
          duration: 0.35,
          ease: 'power2.in',
        },
        0
      );
    }

    // Incoming content: slide in with stagger & de-blur
    if (incoming) {
      tl.fromTo(
        incoming,
        {
          opacity: 0,
          y: isGoingToContact ? 14 : -14,
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.15'
      );
    }

    // Reset glow burst
    if (glowBurstRef.current) {
      tl.to(glowBurstRef.current, { opacity: 0, scale: 1, duration: 0.4 }, '-=0.2');
    }
  };

  return (
    <section id="contacto" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Ambient background light */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] rounded-full bg-urbo-teal/15 blur-[180px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Headline */}
        <div className="mb-10 sm:mb-12">
          <GlassBadge variant="teal" className="mb-3.5">
            ALIANZAS & INVERSIÓN
          </GlassBadge>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
            El futuro del transporte en Santa Cruz{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
              se construye hoy.
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Haz clic en la tarjeta para alternar entre la visión tecnológica y los canales de contacto directo.
          </p>
        </div>

        {/* =================================================================
            HORIZONTAL LIQUID GLASS BUSINESS CARD (ASPECT ~1.75:1)
            Single Plane Content Morph with 3D Mouse Tracking
            ================================================================= */}
        <div className="perspective-1000 flex justify-center mb-8">
          <div
            ref={cardRef}
            tabIndex={0}
            role="button"
            aria-label={
              activeView === 'brand'
                ? 'Tarjeta URBO, mostrando identidad. Haz clic para ver canales de contacto.'
                : 'Tarjeta URBO, mostrando canales de contacto. Haz clic para volver a la identidad.'
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleView();
              }
            }}
            onClick={toggleView}
            className="relative w-full max-w-[580px] aspect-[1.75/1] min-h-[300px] rounded-[32px] p-6 sm:p-8 liquid-glass-elevated border border-white/25 shadow-2xl overflow-hidden cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-urbo-teal transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,201,167,0.2)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Momentary Glow Burst during morph */}
            <div
              ref={glowBurstRef}
              className="absolute -inset-10 rounded-[40px] bg-urbo-teal/20 blur-2xl pointer-events-none opacity-0 z-0"
            />

            {/* Specular Shimmer Light Bar */}
            <div
              ref={sheenRef}
              className="absolute -inset-y-10 w-28 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] pointer-events-none opacity-0 z-30"
            />

            {/* Subtle Line 30 Vector Wave Watermark in Background */}
            <svg
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none z-0"
              viewBox="0 0 580 330"
              fill="none"
            >
              <circle cx="290" cy="165" r="140" stroke="#00C9A7" strokeWidth="1" strokeDasharray="4 6" />
              <path d="M 0,220 Q 180,60 380,210 T 580,110" stroke="#00E5BE" strokeWidth="2" />
            </svg>

            {/* =============================================================
                STATE A: URBO BRANDING & PROTAGONIST CENTERED LOGO
                ============================================================= */}
            <div
              ref={stateARef}
              className={cn(
                'absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10 transition-none',
                activeView === 'brand' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
            >
              {/* Top Row: Protocol Tag & Smart NFC Chip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-urbo-teal2 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-300 uppercase font-semibold">
                    URBO MOBILITY PROTOCOL
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-6.5 rounded-md bg-gradient-to-br from-amber-200/40 via-amber-400/20 to-amber-600/30 border border-amber-300/50 p-1 flex flex-col justify-between shadow-inner">
                    <div className="w-full h-[1px] bg-amber-200/70" />
                    <div className="w-2/3 h-[1px] bg-amber-200/70" />
                    <div className="w-full h-[1px] bg-amber-200/70" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold">NFC</span>
                </div>
              </div>

              {/* Center: Prominent Official Logo & Identity */}
              <div className="my-auto flex flex-col items-center justify-center py-2">
                <div className="relative group flex items-center justify-center">
                  <div className="absolute -inset-4 rounded-full bg-urbo-teal/20 blur-xl group-hover:bg-urbo-teal/35 transition-all duration-500" />
                  <img
                    src="/urbo-logo.png"
                    alt="URBO Logo"
                    className="relative w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-[0_0_20px_rgba(0,201,167,0.6)] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h3 className="font-tech text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase mt-2 leading-none">
                  URBO
                </h3>
                <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-urbo-teal2 uppercase mt-1">
                  SANTA CRUZ · BOLIVIA
                </p>
              </div>

              {/* Bottom Row: Location & Morph Toggle Prompt */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-urbo-teal2" />
                  <span className="text-[11px]">Casco Viejo & Red Troncal</span>
                </div>

                <div className="flex items-center gap-1.5 text-urbo-teal2 font-bold animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Toca para ver contacto</span>
                </div>
              </div>
            </div>

            {/* =============================================================
                STATE B: REAL DIRECT CONTACT & CHANNELS (SAME PLANE MORPH)
                ============================================================= */}
            <div
              ref={stateBRef}
              className={cn(
                'absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10 transition-none text-left',
                activeView === 'contact' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-900 border border-white/15 p-1 flex items-center justify-center">
                    <img src="/urbo-logo.png" alt="URBO" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-urbo-teal2 uppercase">
                    CANALES DIRECTOS · URBO
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-urbo-teal2" />
                  <span>Volver al resumen</span>
                </span>
              </div>

              {/* Direct Channels (Stops propagation to allow clicking link directly) */}
              <div className="space-y-2.5 my-auto" onClick={(e) => e.stopPropagation()}>
                {/* Email */}
                <a
                  href="mailto:josemariorc@urbocorp.com"
                  className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-urbo-teal/40 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-urbo-teal/15 text-urbo-teal2 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        Correo Oficial Fundadores
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-urbo-teal2 transition-colors font-mono">
                        josemariorc@urbocorp.com
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-urbo-teal2" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/59178556677"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-urbo-teal/40 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        WhatsApp Directo · Coordinación
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-urbo-teal2 transition-colors font-mono">
                        +591 78556677 · Comunidad URBO
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-urbo-teal2" />
                </a>
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span className="truncate">Santa Cruz de la Sierra, Bolivia</span>
                <span className="text-urbo-teal2 font-bold flex-shrink-0">RESPUESTA &lt; 24H</span>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Action Pill Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="mailto:josemariorc@urbocorp.com"
            className="apple-pill-primary px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 text-slate-950 shadow-[0_0_25px_rgba(0,201,167,0.3)] hover:shadow-[0_0_35px_rgba(0,201,167,0.5)] transition-shadow"
          >
            <span>Escribir al equipo fundador</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>

          <a
            href="https://wa.me/59178556677"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-pill-secondary px-5 sm:px-6 py-3.5 text-xs sm:text-sm flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Hablar por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={toggleView}
            className="px-5 py-3.5 rounded-full bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/15 text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:border-urbo-teal2/50 transition-all flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-urbo-teal2', animating && 'animate-spin')} />
            <span>
              {activeView === 'brand' ? 'Ver canales de contacto' : 'Volver a la tarjeta'}
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};
