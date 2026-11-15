import React, { useState, useRef } from 'react';
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  ArrowUpRight, 
  ExternalLink, 
  X, 
  Sparkles, 
  Instagram,
  Radio,
  Cpu,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export const FinalCta: React.FC = () => {
  const [isProjected, setIsProjected] = useState(false);
  const [animating, setAnimating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const hologramStageRef = useRef<HTMLDivElement>(null);
  const laserBeamRef = useRef<HTMLDivElement>(null);
  const holoPanelRef = useRef<HTMLDivElement>(null);

  // Emerge real holographic projection from the card's top edge
  const openHologram = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (animating || isProjected) return;
    setAnimating(true);
    setIsProjected(true);

    const tl = gsap.timeline({
      onComplete: () => setAnimating(false),
    });

    // 1. Energize card top border with neon laser beam
    tl.fromTo(
      laserBeamRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.35, ease: 'power3.out' }
    );

    // 2. Holographic panel projects vertically upward with perspective elevation
    tl.fromTo(
      holoPanelRef.current,
      {
        opacity: 0,
        y: 40,
        scaleY: 0.2,
        scaleX: 0.85,
        transformOrigin: '50% 100%',
      },
      {
        opacity: 1,
        y: 0,
        scaleY: 1,
        scaleX: 1,
        duration: 0.55,
        ease: 'back.out(1.2)',
      },
      '-=0.15'
    );

    // 3. Stagger channels reveal
    tl.fromTo(
      '.holo-channel-item',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.3, ease: 'power2.out' },
      '-=0.25'
    );
  };

  const closeHologram = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (animating || !isProjected) return;
    setAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsProjected(false);
        setAnimating(false);
      },
    });

    // Collapse holographic projection back into the card emitter
    tl.to(holoPanelRef.current, {
      opacity: 0,
      y: 35,
      scaleY: 0.1,
      scaleX: 0.9,
      duration: 0.35,
      ease: 'power2.in',
    });

    tl.to(laserBeamRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    }, '-=0.1');
  };

  return (
    <section id="contacto" className="relative py-24 lg:py-32 overflow-visible bg-[#070B14]">
      {/* Anchor alias */}
      <span id="unirse" className="absolute -top-32" />

      {/* Atmospheric ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[600px] rounded-full bg-[#00C9A7]/10 blur-[200px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[#38BDF8]/10 blur-[180px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Headline */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1426] border border-white/10 text-[#00E5BE] text-xs font-mono font-bold tracking-wider uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" />
            <span>ALIANZAS, LÍNEAS & INVERSIÓN</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-tech">
            El futuro del transporte en Santa Cruz{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5BE] via-[#38BDF8] to-[#00E5BE] font-tech">
              se construye hoy.
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto font-sans">
            Presiona el botón de la tarjeta URBO para activar la proyección holográfica de contacto directo con los fundadores y canales oficiales.
          </p>
        </div>

        {/* =================================================================
            HOLOGRAM & CARD APPARATUS CONTAINER
            ================================================================= */}
        <div ref={hologramStageRef} className="relative flex flex-col items-center justify-center max-w-[840px] mx-auto mb-12">
          
          {/* =============================================================
              EMERGING HOLOGRAPHIC PROJECTION PANEL (EMERGES UPWARD)
              ============================================================= */}
          <div
            ref={holoPanelRef}
            className={cn(
              'w-full max-w-[800px] rounded-[32px] p-6 sm:p-8 mb-4 bg-gradient-to-b from-[#0F1C35]/95 via-[#0B1426]/95 to-[#070B14]/95 border-2 border-[#00E5BE]/60 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,229,190,0.35),inset_0_0_30px_rgba(0,201,167,0.15)] text-left transition-all relative z-30',
              isProjected ? 'block' : 'hidden opacity-0 pointer-events-none'
            )}
          >
            {/* Holographic Scanline Watermark */}
            <div 
              aria-hidden="true" 
              className="absolute inset-0 pointer-events-none opacity-15 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00E5BE_3px,#00E5BE_3px)] [background-size:100%_4px] rounded-[30px]" 
            />

            {/* Header: Projection Tag & Close Button */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#00E5BE]/30 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5BE] animate-ping" />
                <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#00E5BE] uppercase font-tech">
                  PROYECCIÓN HOLOGRÁFICA · PROTOCOLO URBO
                </span>
              </div>

              <button
                type="button"
                onClick={closeHologram}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-200 transition-colors cursor-pointer border border-white/15"
              >
                <X className="w-3.5 h-3.5 text-[#00E5BE]" />
                <span>Cerrar</span>
              </button>
            </div>

            {/* Channels Grid (Email, WhatsApp, Instagram) */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              
              {/* 1. Official Email */}
              <a
                href="mailto:josemariorc@urbocorp.com"
                className="holo-channel-item p-4 sm:p-5 rounded-2xl bg-[#070B14]/80 border border-[#00C9A7]/30 hover:border-[#00E5BE] transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_30px_rgba(0,201,167,0.25)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00C9A7]/20 text-[#00E5BE] flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00E5BE] transition-colors" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                    Correo Fundadores
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00E5BE] transition-colors font-mono break-all">
                    josemariorc@urbocorp.com
                  </span>
                </div>
              </a>

              {/* 2. WhatsApp Directo */}
              <a
                href="https://wa.me/59178556677"
                target="_blank"
                rel="noopener noreferrer"
                className="holo-channel-item p-4 sm:p-5 rounded-2xl bg-[#070B14]/80 border border-[#00C9A7]/30 hover:border-[#00E5BE] transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_30px_rgba(0,201,167,0.25)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00C9A7]/20 text-[#00E5BE] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#00E5BE] transition-colors" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                    WhatsApp Directo
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00E5BE] transition-colors font-mono">
                    +591 78556677 · SCZ
                  </span>
                </div>
              </a>

              {/* 3. Instagram Oficial */}
              <a
                href="https://www.instagram.com/urbo.corp/"
                target="_blank"
                rel="noopener noreferrer"
                className="holo-channel-item p-4 sm:p-5 rounded-2xl bg-[#070B14]/80 border border-pink-500/30 hover:border-pink-500 transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_30px_rgba(225,48,108,0.25)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md">
                    <Instagram className="w-5 h-5 fill-current stroke-none" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-pink-300 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-pink-300 block uppercase font-bold">
                    Instagram Oficial
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition-colors font-mono">
                    @urbo.corp
                  </span>
                </div>
              </a>

            </div>

            {/* Projection Footer Status */}
            <div className="relative z-10 pt-3 border-t border-[#00E5BE]/30 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-300 gap-2">
              <span>Santa Cruz de la Sierra · Bolivia</span>
              <span className="text-[#00E5BE] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                RESPUESTA &lt; 24H · EQUIPO FUNDADOR
              </span>
            </div>
          </div>

          {/* =============================================================
              LASER EMITTER BEAM (APPEARS ON TOP EDGE OF BASE CARD)
              ============================================================= */}
          <div
            ref={laserBeamRef}
            aria-hidden="true"
            className={cn(
              'w-[92%] h-[3px] bg-gradient-to-r from-transparent via-[#00E5BE] to-transparent shadow-[0_0_20px_#00E5BE,0_0_35px_#38BDF8] z-20 mb-[-1.5px] transition-all',
              isProjected ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            )}
          />

          {/* =============================================================
              BASE URBO CARD (PERMANENT PHYSICAL FLAGSHIP ANCHOR)
              ============================================================= */}
          <div
            ref={cardRef}
            className="relative w-full max-w-[820px] min-h-[360px] sm:min-h-[380px] rounded-[36px] p-6 sm:p-10 bg-gradient-to-b from-[#0F1C35] via-[#0B1426] to-[#070B14] border border-[#00C9A7]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,201,167,0.18)] overflow-hidden select-none z-10 flex flex-col justify-between"
          >
            {/* Top Beveled Specular Edge */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20"
            />

            {/* Subtle Grid Watermark */}
            <div 
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#00C9A7_1px,transparent_1px)] [background-size:20px_20px] z-0" 
            />

            {/* Top Row: Protocol Status & Smart NFC Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5BE] animate-pulse shadow-[0_0_8px_#00E5BE]" />
                <span className="text-[11px] font-mono tracking-widest text-[#00E5BE] uppercase font-bold font-tech">
                  URBO MOBILITY PROTOCOL · SCZ
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200/40 via-amber-400/20 to-amber-600/30 border border-amber-300/50 p-1 flex flex-col justify-between shadow-inner">
                  <div className="w-full h-[1px] bg-amber-200/70" />
                  <div className="w-2/3 h-[1px] bg-amber-200/70" />
                  <div className="w-full h-[1px] bg-amber-200/70" />
                </div>
                <span className="text-[10px] font-mono text-[#F4C430] font-bold">NFC ACTIVE</span>
              </div>
            </div>

            {/* Center: Protagonist Official Logo & Identity */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center py-4">
              <div className="relative group flex items-center justify-center">
                <div className="absolute -inset-6 rounded-full bg-[#00C9A7]/25 blur-2xl group-hover:bg-[#00C9A7]/40 transition-all duration-500" />
                <UrboLogo
                  size={92}
                  className="relative transition-transform duration-500 group-hover:scale-105 shadow-[0_0_35px_rgba(0,201,167,0.5)]"
                />
              </div>

              <h3 className="font-tech text-3xl sm:text-4xl font-black text-white tracking-[0.25em] uppercase mt-4 leading-none">
                URBO
              </h3>
              <p className="text-xs sm:text-sm font-mono tracking-[0.3em] text-[#00E5BE] uppercase mt-1.5 font-bold">
                SANTA CRUZ DE LA SIERRA · BOLIVIA
              </p>
              <div className="text-[11px] font-mono text-slate-400 mt-2 font-sans">
                Mapeo en vivo · Aviso por voz a 300m · Red Troncal
              </div>
            </div>

            {/* Bottom Row: Location & Mandatory "Contáctanos" Button */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-slate-300 gap-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00E5BE]" />
                <span>Casco Viejo & Zona Norte (Línea 30)</span>
              </div>

              {/* Exact user requested CTA button: "Contáctanos" */}
              <button
                type="button"
                onClick={isProjected ? closeHologram : openHologram}
                className="flex items-center gap-2 text-slate-950 font-bold transition-all bg-[#00C9A7] hover:bg-[#00E5BE] px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(0,201,167,0.5)] hover:shadow-[0_0_30px_rgba(0,229,190,0.8)] hover:scale-105 active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProjected ? 'Ocultar proyección' : 'Contáctanos'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Quick Action Direct Links below Card */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="mailto:josemariorc@urbocorp.com"
            className="px-6 sm:px-7 py-3 rounded-full bg-[#00C9A7] text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-[0_0_20px_rgba(0,201,167,0.35)] hover:bg-[#00E5BE] hover:scale-105 transition-all"
          >
            <span>Escribir al equipo fundador</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>

          <a
            href="https://wa.me/59178556677"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 sm:px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-[#00E5BE]" />
            <span>Hablar por WhatsApp</span>
          </a>

          <a
            href="https://www.instagram.com/urbo.corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 sm:px-6 py-3 rounded-full bg-gradient-to-r from-[#833ab4]/80 via-[#fd1d1d]/80 to-[#fcb045]/80 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-md hover:shadow-[0_0_20px_rgba(253,29,29,0.35)]"
          >
            <Instagram className="w-4 h-4 fill-current stroke-none" />
            <span>Instagram @urbo.corp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
export default FinalCta;
