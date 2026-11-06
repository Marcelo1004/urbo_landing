import React, { useState, useRef, useEffect } from 'react';
import { Mail, MessageCircle, MapPin, ArrowUpRight, RotateCw, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';
import { GlassSurface, GlassBadge } from '@/components/ui/Glass';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export const FinalCta: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  // 3D Tilt and Mouse Light Sheen Tracking with GSAP QuickTo
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const xTo = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power2.out' });
    const yTo = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt max +- 8 degrees
      const rotY = ((x - centerX) / centerX) * 8;
      const rotX = -((y - centerY) / centerY) * 8;

      xTo(rotY);
      yTo(rotX);

      // Move sheen highlight
      if (sheenRef.current) {
        gsap.to(sheenRef.current, {
          x: (x - centerX) * 1.2,
          y: (y - centerY) * 1.2,
          opacity: 0.7,
          duration: 0.3,
          ease: 'power1.out',
        });
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      if (sheenRef.current) {
        gsap.to(sheenRef.current, { opacity: 0, duration: 0.6 });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="contacto" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Ambient background light */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-full bg-urbo-teal/15 blur-[190px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Headline */}
        <div className="mb-12">
          <GlassBadge variant="teal" className="mb-4">
            ALIANZAS & INVERSIÓN
          </GlassBadge>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            El futuro del transporte en Santa Cruz{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
              se construye hoy.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Gira la tarjeta para acceder a los canales de contacto directo con el equipo fundador.
          </p>
        </div>

        {/* =================================================================
            LIQUID GLASS BUSINESS CARD (3D TILT & FLIP)
            ================================================================= */}
        <div ref={containerRef} className="perspective-1000 flex justify-center mb-8">
          <div
            ref={cardRef}
            className={cn(
              'relative w-full max-w-[540px] aspect-[1.65/1] rounded-[36px] transition-transform duration-700 preserve-3d cursor-pointer select-none',
              isFlipped && 'rotate-y-180'
            )}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Specular Dynamic Sheen Overlay */}
            <div
              ref={sheenRef}
              className="absolute -inset-10 bg-gradient-to-tr from-transparent via-white/15 to-transparent rounded-full blur-xl pointer-events-none opacity-0 z-30"
            />

            {/* =============================================================
                CARD FRONT: BRAND IDENTITY, CHIP & WATERMARK ROUTE
                ============================================================= */}
            <div className="absolute inset-0 w-full h-full rounded-[36px] p-7 sm:p-9 liquid-glass-elevated border-white/25 shadow-2xl flex flex-col justify-between backface-hidden overflow-hidden">
              {/* Santa Cruz Route Line Watermark in Background */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 500 300" fill="none">
                <circle cx="250" cy="150" r="120" stroke="#00C9A7" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 0,200 Q 150,50 350,180 T 500,80" stroke="#00E5BE" strokeWidth="2.5" />
              </svg>

              {/* Card Top: Brand & Smart Chip */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/20 p-1.5 flex items-center justify-center shadow-lg">
                    <img src="/urbo-logo.png" alt="URBO" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <span className="font-tech text-xl font-black text-white tracking-wider block leading-none">
                      URBO
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-urbo-teal2">
                      MOBILITY PROTOCOL
                    </span>
                  </div>
                </div>

                {/* Futuristic NFC Smart Chip Graphic */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-amber-200/30 to-amber-500/20 border border-amber-300/40 p-1 flex flex-col justify-between shadow-inner">
                    <div className="w-full h-[1px] bg-amber-200/50" />
                    <div className="w-1/2 h-[1px] bg-amber-200/50" />
                    <div className="w-full h-[1px] bg-amber-200/50" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">NFC</span>
                </div>
              </div>

              {/* Card Center: Tagline & Proof */}
              <div className="text-left z-10 my-auto">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                  INFRAESTRUCTURA DE TRANSPORTE PÚBLICO
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-tech">
                  Tu micro. En tiempo real.
                </h3>
              </div>

              {/* Card Bottom: Region & Flip Prompt */}
              <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-urbo-teal2" />
                  <span>Santa Cruz de la Sierra, Bolivia</span>
                </div>

                <div className="flex items-center gap-1.5 text-urbo-teal2 font-bold animate-pulse">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Toca para ver contacto</span>
                </div>
              </div>
            </div>

            {/* =============================================================
                CARD BACK: DIRECT CONTACT INFORMATION & CHANNELS
                ============================================================= */}
            <div className="absolute inset-0 w-full h-full rounded-[36px] p-7 sm:p-9 liquid-glass-elevated border-urbo-teal/30 shadow-2xl flex flex-col justify-between backface-hidden rotate-y-180 overflow-hidden text-left">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold tracking-wider text-urbo-teal2 uppercase">
                  CANALES DIRECTOS DE CONTACTO
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  Volver al frente
                </span>
              </div>

              {/* Contact Data Items */}
              <div className="space-y-3.5 my-auto" onClick={(e) => e.stopPropagation()}>
                {/* Email */}
                <a
                  href="mailto:josemariorc@urbocorp.com"
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-urbo-teal/40 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-urbo-teal/15 text-urbo-teal2 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Correo Oficial</span>
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-urbo-teal2 transition-colors font-mono">
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
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-urbo-teal/40 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">WhatsApp Directo</span>
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-urbo-teal2 transition-colors font-mono">
                        +591 78556677 · Comunidad URBO
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-urbo-teal2" />
                </a>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Alianzas con directivas de líneas e inversores</span>
                <span className="text-urbo-teal2 font-bold">RESPUESTA EN 24H</span>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Action Pill Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:josemariorc@urbocorp.com"
            className="apple-pill-primary px-7 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 text-slate-950"
          >
            <span>Escribir al equipo fundador</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>

          <a
            href="https://wa.me/59178556677"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-pill-secondary px-6 py-3.5 text-xs sm:text-sm flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Hablar por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Girar tarjeta</span>
          </button>
        </div>

      </div>
    </section>
  );
};
