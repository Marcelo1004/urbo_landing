import React, { useState, useRef } from 'react';
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  ArrowUpRight, 
  ExternalLink, 
  RefreshCw, 
  Sparkles, 
  Instagram,
  Radio,
  Cpu,
  Layers
} from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { motion } from '@/motion/motionTokens';

export const FinalCta: React.FC = () => {
  // 'brand' (State A) vs 'hologram' (State B - Holographic Contact Matrix)
  const [activeView, setActiveView] = useState<'brand' | 'hologram'>('brand');
  const [animating, setAnimating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const stateARef = useRef<HTMLDivElement>(null);
  const stateBRef = useRef<HTMLDivElement>(null);
  const holoBeamRef = useRef<HTMLDivElement>(null);

  // Smooth Holographic Content Reveal via GSAP
  const toggleView = () => {
    if (animating) return;
    setAnimating(true);

    const isGoingToHolo = activeView === 'brand';
    const outgoing = isGoingToHolo ? stateARef.current : stateBRef.current;
    const incoming = isGoingToHolo ? stateBRef.current : stateARef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveView(isGoingToHolo ? 'hologram' : 'brand');
        setAnimating(false);
      },
    });

    // Holographic emerald beam wave
    if (holoBeamRef.current) {
      tl.fromTo(
        holoBeamRef.current,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 0.9, duration: 0.35, ease: 'power2.out' },
        0
      ).to(holoBeamRef.current, { opacity: 0.25, duration: 0.4 }, '+=0.1');
    }

    // Outgoing transition
    if (outgoing) {
      tl.to(
        outgoing,
        {
          opacity: 0,
          scale: 0.98,
          duration: 0.22,
          ease: 'power2.in',
        },
        0
      );
    }

    // Incoming transition
    if (incoming) {
      tl.fromTo(
        incoming,
        {
          opacity: 0,
          scale: 1.02,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.32,
          ease: 'power2.out',
        },
        '-=0.08'
      );
    }
  };

  return (
    <section id="contacto" className="relative py-20 lg:py-28 overflow-hidden bg-[#0F1D36]">
      {/* Anchor alias */}
      <span id="unirse" className="absolute -top-32" />

      {/* Atmospheric ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-full bg-emerald-500/15 blur-[190px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Headline */}
        <div className="mb-10 sm:mb-14">
          <GlassBadge variant="emerald" className="mb-4">
            ALIANZAS, LÍNEAS & INVERSIÓN
          </GlassBadge>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-tech">
            El futuro del transporte en Santa Cruz{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-tech">
              se construye hoy.
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
            Interactúa con la tarjeta para proyectar la matriz holográfica de contacto directo con los fundadores y canales oficiales de URBO.
          </p>
        </div>

        {/* =================================================================
            REDISEÑO TARJETA FINAL: MÁS ALARGADA, MÁS ALTA, PROYECCIÓN HOLOGRÁFICA
            Dimensions: max-w-[820px], min-h-[420px], Aspect ~ 1.9:1
            ================================================================= */}
        <div className="flex justify-center mb-10">
          <div
            ref={cardRef}
            onClick={toggleView}
            className="relative w-full max-w-[820px] min-h-[420px] sm:min-h-[440px] rounded-[36px] p-6 sm:p-10 bg-gradient-to-b from-[#162744] via-[#0F1D36] to-[#0A1220] border border-emerald-500/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(16,185,129,0.2)] overflow-hidden cursor-pointer select-none transition-all duration-300 hover:border-emerald-400/60"
          >
            {/* Beveled Top Specular Edge Highlight */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20"
            />

            {/* Holographic Emitter Laser Grid Watermark */}
            <div 
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:20px_20px] z-0" 
            />

            {/* Holographic Projection Beam (Expands during morph) */}
            <div
              ref={holoBeamRef}
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none bg-gradient-to-t from-emerald-500/25 via-emerald-400/10 to-transparent opacity-0 origin-bottom z-10 transition-opacity"
            />

            {/* =============================================================
                STATE A: URBO FLAGSHIP BRANDING & REAL PROTOCOL CARD
                ============================================================= */}
            <div
              ref={stateARef}
              className={cn(
                'absolute inset-0 p-6 sm:p-10 flex flex-col justify-between z-20 transition-all duration-300',
                activeView === 'brand' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
            >
              {/* Top Row: Protocol Tag & Smart NFC Chip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                  <span className="text-[11px] font-mono tracking-widest text-emerald-300 uppercase font-bold">
                    URBO MOBILITY PROTOCOL · v5.6
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200/40 via-amber-400/20 to-amber-600/30 border border-amber-300/50 p-1 flex flex-col justify-between shadow-inner">
                    <div className="w-full h-[1px] bg-amber-200/70" />
                    <div className="w-2/3 h-[1px] bg-amber-200/70" />
                    <div className="w-full h-[1px] bg-amber-200/70" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">NFC ACTIVE</span>
                </div>
              </div>

              {/* Center: Protagonist Official Logo & Identity */}
              <div className="my-auto flex flex-col items-center justify-center py-4">
                <div className="relative group flex items-center justify-center">
                  <div className="absolute -inset-6 rounded-full bg-emerald-500/25 blur-2xl group-hover:bg-emerald-500/40 transition-all duration-500" />
                  <UrboLogo
                    size={96}
                    className="relative transition-transform duration-500 group-hover:scale-105 shadow-[0_0_35px_rgba(16,185,129,0.5)]"
                  />
                </div>

                <h3 className="font-tech text-3xl sm:text-4xl font-black text-white tracking-[0.25em] uppercase mt-4 leading-none">
                  URBO
                </h3>
                <p className="text-xs sm:text-sm font-mono tracking-[0.3em] text-emerald-300 uppercase mt-1.5 font-bold">
                  SANTA CRUZ DE LA SIERRA · BOLIVIA
                </p>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  Mapeo en vivo · Aviso por voz a 300m · Red Troncal
                </div>
              </div>

              {/* Bottom Row: Location & Holographic Trigger */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Casco Viejo & Zona Norte (Línea 30)</span>
                </div>

                <button
                  type="button"
                  onClick={toggleView}
                  className="flex items-center gap-2 text-slate-950 font-bold transition-all bg-emerald-400 hover:bg-emerald-300 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs">Proyectar canales holográficos</span>
                </button>
              </div>
            </div>

            {/* =============================================================
                STATE B: HOLOGRAPHIC CONTACT MATRIX & SOCIAL CHANNELS
                Refined Emerald Hologram with Direct Channels & Instagram
                ============================================================= */}
            <div
              ref={stateBRef}
              className={cn(
                'absolute inset-0 p-6 sm:p-10 flex flex-col justify-between z-20 transition-all duration-300 text-left',
                activeView === 'hologram' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
            >
              {/* Holographic Header */}
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-emerald-300 uppercase">
                    PROYECCIÓN HOLOGRÁFICA · CANALES ACTIVOS
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleView}
                  className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-white/10 hover:bg-white/15 px-3 py-1 rounded-full border border-white/15"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Volver a la tarjeta</span>
                </button>
              </div>

              {/* Direct Channels Grid (Email, WhatsApp, Instagram) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-auto py-3" onClick={(e) => e.stopPropagation()}>
                
                {/* 1. Official Email */}
                <a
                  href="mailto:josemariorc@urbocorp.com"
                  className="p-4 rounded-2xl bg-[#0B1526] border border-white/12 hover:border-emerald-400/50 transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_25px_rgba(16,185,129,0.2)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Correo Fundadores
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors font-mono break-all">
                      josemariorc@urbocorp.com
                    </span>
                  </div>
                </a>

                {/* 2. WhatsApp Directo */}
                <a
                  href="https://wa.me/59178556677"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#0B1526] border border-white/12 hover:border-emerald-400/50 transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_25px_rgba(16,185,129,0.2)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      WhatsApp Directo
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors font-mono">
                      +591 78556677 · SCZ
                    </span>
                  </div>
                </a>

                {/* 3. Instagram Oficial con Gradiente Auténtico */}
                <a
                  href="https://www.instagram.com/urbo.corp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#833ab4]/30 via-[#fd1d1d]/20 to-[#fcb045]/20 border border-pink-500/30 hover:border-pink-500/60 transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_25px_rgba(253,29,29,0.25)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md">
                      <Instagram className="w-4 h-4 fill-current stroke-none" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-pink-300 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-pink-200 block uppercase font-semibold">
                      Instagram Oficial
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors font-mono">
                      @urbo.corp
                    </span>
                  </div>
                </a>

              </div>

              {/* Holographic Footer */}
              <div className="pt-3 border-t border-emerald-500/30 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Santa Cruz de la Sierra · Bolivia</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  RESPUESTA &lt; 24H · EQUIPO FUNDADOR
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Action Pill Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="mailto:josemariorc@urbocorp.com"
            className="px-6 sm:px-7 py-3.5 rounded-full bg-emerald-500 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:scale-105 transition-all"
          >
            <span>Escribir al equipo fundador</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>

          <a
            href="https://wa.me/59178556677"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 sm:px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Hablar por WhatsApp</span>
          </a>

          <a
            href="https://www.instagram.com/urbo.corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 sm:px-6 py-3.5 rounded-full bg-gradient-to-r from-[#833ab4]/80 via-[#fd1d1d]/80 to-[#fcb045]/80 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-md hover:shadow-[0_0_25px_rgba(253,29,29,0.4)]"
          >
            <Instagram className="w-4 h-4 fill-current stroke-none" />
            <span>Instagram @urbo.corp</span>
          </a>

          <button
            type="button"
            onClick={toggleView}
            className="px-5 py-3.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-slate-300 hover:text-white hover:border-emerald-400/50 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-emerald-400', animating && 'animate-spin')} />
            <span>
              {activeView === 'brand' ? 'Ver canales holográficos' : 'Volver a la tarjeta'}
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};
