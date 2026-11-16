import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle2,
  ShieldCheck,
  Send
} from 'lucide-react';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export const FinalCta: React.FC = () => {
  const [isProjected, setIsProjected] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const socialPanelRef = useRef<HTMLDivElement>(null);

  const leftBeamRef = useRef<HTMLDivElement>(null);
  const rightBeamRef = useRef<HTMLDivElement>(null);
  const socialBeamRef = useRef<HTMLDivElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Setup single coordinated reversible GSAP timeline for lateral independent projections
  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const leftP = leftPanelRef.current;
    const rightP = rightPanelRef.current;
    const socialP = socialPanelRef.current;
    const leftB = leftBeamRef.current;
    const rightB = rightBeamRef.current;
    const socialB = socialBeamRef.current;

    if (!stage || !card || !leftP || !rightP || !socialP) return;

    const ctx = gsap.context(() => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

      if (isDesktop) {
        // Desktop 3D Spatial Lateral layout
        gsap.set(leftP, {
          opacity: 0,
          x: 40,
          scale: 0.88,
          rotateY: 18,
          transformOrigin: '100% 50%',
          pointerEvents: 'none',
        });
        gsap.set(rightP, {
          opacity: 0,
          x: -40,
          scale: 0.88,
          rotateY: -18,
          transformOrigin: '0% 50%',
          pointerEvents: 'none',
        });
        gsap.set(socialP, {
          opacity: 0,
          y: -25,
          scale: 0.88,
          transformOrigin: '50% 0%',
          pointerEvents: 'none',
        });
        if (leftB) gsap.set(leftB, { scaleX: 0, opacity: 0 });
        if (rightB) gsap.set(rightB, { scaleX: 0, opacity: 0 });
        if (socialB) gsap.set(socialB, { scaleY: 0, opacity: 0 });
      } else {
        // Mobile / Tablet stacked presentation
        gsap.set([leftP, rightP, socialP], {
          opacity: 0,
          y: 25,
          scale: 0.95,
          pointerEvents: 'none',
          display: 'none',
        });
      }

      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          setIsProjected(true);
          if (!isDesktop) {
            gsap.set([leftP, rightP, socialP], { display: 'block' });
          }
        },
        onReverseComplete: () => {
          setIsProjected(false);
          if (!isDesktop) {
            gsap.set([leftP, rightP, socialP], { display: 'none' });
          }
        },
      });

      if (isDesktop) {
        // Step 1: Fire lateral and downward laser emitters
        if (leftB && rightB && socialB) {
          tl.to([leftB, rightB], {
            scaleX: 1,
            opacity: 1,
            duration: 0.25,
            ease: 'power3.out',
          }).to(socialB, {
            scaleY: 1,
            opacity: 1,
            duration: 0.25,
            ease: 'power3.out',
          }, '-=0.15');
        }

        // Step 2: Project Left Panel (Email)
        tl.to(leftP, {
          opacity: 1,
          x: 0,
          scale: 1,
          rotateY: 6,
          pointerEvents: 'auto',
          duration: 0.45,
          ease: 'back.out(1.15)',
        }, '-=0.15')
        // Step 3: Project Right Panel (WhatsApp)
        .to(rightP, {
          opacity: 1,
          x: 0,
          scale: 1,
          rotateY: -6,
          pointerEvents: 'auto',
          duration: 0.45,
          ease: 'back.out(1.15)',
        }, '-=0.35')
        // Step 4: Project Social Satellite (Instagram)
        .to(socialP, {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.40,
          ease: 'back.out(1.15)',
        }, '-=0.30')
        // Step 5: Specular sheen sweep across all holograms
        .fromTo('.holo-specular-sweep', 
          { x: '-100%', opacity: 0 },
          { x: '250%', opacity: 0.45, duration: 0.65, ease: 'power1.inOut' },
          '-=0.15'
        );
      } else {
        // Mobile sequence
        tl.to([leftP, rightP, socialP], {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          stagger: 0.12,
          duration: 0.35,
          ease: 'power2.out',
        });
      }

      tlRef.current = tl;
    }, stage);

    return () => ctx.revert();
  }, []);

  const toggleHologram = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!tlRef.current) return;
    if (isProjected) {
      tlRef.current.reverse();
    } else {
      tlRef.current.play();
    }
  };

  const closeHologram = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!tlRef.current) return;
    tlRef.current.reverse();
  };

  return (
    <section id="contacto" className="relative py-16 lg:py-20 overflow-x-clip bg-[#070B14]">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Headline */}
        <div className="mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1426] border border-white/10 text-[#00E5BE] text-xs font-mono font-bold tracking-wider uppercase mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5BE] animate-pulse shadow-[0_0_8px_#00E5BE]" />
            <span>ALIANZAS, LÍNEAS & INVERSIÓN</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-tech">
            El futuro del transporte en Santa Cruz{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5BE] via-[#38BDF8] to-[#00E5BE] font-tech">
              se construye hoy.
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto font-sans">
            Haz clic en <span className="text-[#00E5BE] font-semibold">Contáctanos</span> para proyectar los canales oficiales y entablar contacto directo con el equipo fundador.
          </p>
        </div>

        {/* =================================================================
            SPATIAL CONTACT APPARATUS (CENTRAL CARD + 3 LATERAL HOLOGRAPHIC PROJECTIONS)
            ================================================================= */}
        <div 
          ref={stageRef} 
          className="relative flex flex-col items-center justify-center max-w-[560px] mx-auto mb-16 lg:mb-28"
          style={{ perspective: '1200px' }}
        >

          {/* =============================================================
              1. LEFT LATERAL PROJECTION: OFFICIAL EMAIL (DESKTOP LATERAL / MOBILE STACK)
              ============================================================= */}
          <div
            ref={leftPanelRef}
            className="w-full max-w-sm lg:w-[325px] lg:absolute lg:right-[calc(100%+3.2rem)] lg:top-4 z-30 mb-4 lg:mb-0 rounded-3xl p-6 bg-gradient-to-b from-[#0F1C35]/96 via-[#0B1426]/96 to-[#070B14]/96 border-2 border-[#00C9A7]/50 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,201,167,0.3),inset_0_0_20px_rgba(0,229,190,0.15)] text-left relative star-wars-hologram overflow-hidden"
          >
            {/* Specular sheen sweep */}
            <div className="holo-specular-sweep pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#00C9A7]/30 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-ping" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#00E5BE] uppercase font-tech">
                  CANAL ENCRIPTADO · 01
                </span>
              </div>
              <button
                type="button"
                onClick={closeHologram}
                className="lg:hidden p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Channel Body */}
            <a
              href="mailto:josemariorc@urbocorp.com"
              className="relative z-10 flex flex-col gap-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#00C9A7]/20 text-[#00E5BE] flex items-center justify-center border border-[#00C9A7]/40 shadow-[0_0_15px_rgba(0,201,167,0.3)] group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-[#00E5BE] group-hover:underline">
                  <span>Escribir</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
                  Correo Fundadores
                </span>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00E5BE] transition-colors font-mono break-all">
                  josemariorc@urbocorp.com
                </span>
              </div>
            </a>

            {/* Footer status */}
            <div className="relative z-10 pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-[#00E5BE] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Respuesta &lt; 24h
              </span>
              <span className="text-slate-400">Equipo Directivo</span>
            </div>
          </div>

          {/* Left Laser Emitter Beam (Desktop) */}
          <div
            ref={leftBeamRef}
            aria-hidden="true"
            className="hidden lg:block absolute right-full top-24 w-14 h-[2.5px] bg-gradient-to-l from-[#00E5BE] to-transparent shadow-[0_0_15px_#00E5BE] z-20 origin-right pointer-events-none"
          />

          {/* =============================================================
              2. RIGHT LATERAL PROJECTION: WHATSAPP DIRECTO (DESKTOP LATERAL / MOBILE STACK)
              ============================================================= */}
          <div
            ref={rightPanelRef}
            className="w-full max-w-sm lg:w-[325px] lg:absolute lg:left-[calc(100%+3.2rem)] lg:top-4 z-30 mb-4 lg:mb-0 rounded-3xl p-6 bg-gradient-to-b from-[#0F1C35]/96 via-[#0B1426]/96 to-[#070B14]/96 border-2 border-[#38BDF8]/50 backdrop-blur-2xl shadow-[0_0_40px_rgba(56,189,248,0.3),inset_0_0_20px_rgba(56,189,248,0.15)] text-left relative star-wars-hologram overflow-hidden"
          >
            {/* Specular sheen sweep */}
            <div className="holo-specular-sweep pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#38BDF8]/30 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#38BDF8] uppercase font-tech">
                  CANAL DIRECTO · 02
                </span>
              </div>
              <button
                type="button"
                onClick={closeHologram}
                className="lg:hidden p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Channel Body */}
            <a
              href="https://wa.me/59178556677"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex flex-col gap-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#00E5BE]/20 text-[#00E5BE] flex items-center justify-center border border-[#00E5BE]/40 shadow-[0_0_15px_rgba(0,229,190,0.3)] group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-[#38BDF8] group-hover:underline">
                  <span>Abrir chat</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
                  WhatsApp Oficial
                </span>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#38BDF8] transition-colors font-mono">
                  +591 78556677 · SCZ
                </span>
              </div>
            </a>

            {/* Footer status */}
            <div className="relative z-10 pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-[#38BDF8] font-semibold">
                <Radio className="w-3 h-3 animate-pulse" />
                Enlace Directo
              </span>
              <span className="text-slate-400">Santa Cruz</span>
            </div>
          </div>

          {/* Right Laser Emitter Beam (Desktop) */}
          <div
            ref={rightBeamRef}
            aria-hidden="true"
            className="hidden lg:block absolute left-full top-24 w-14 h-[2.5px] bg-gradient-to-r from-[#38BDF8] to-transparent shadow-[0_0_15px_#38BDF8] z-20 origin-left pointer-events-none"
          />

          {/* =============================================================
              3. BASE URBO FLAGSHIP CARD (CENTRAL ANCHOR, PROPORTIONED & BALANCED)
              ============================================================= */}
          <div
            ref={cardRef}
            className="relative w-full min-h-[440px] rounded-[36px] p-7 sm:p-9 bg-gradient-to-b from-[#0F1C35] via-[#0B1426] to-[#070B14] border border-[#00C9A7]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,201,167,0.18)] overflow-hidden select-none z-20 flex flex-col justify-between"
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
            <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
              <div className="relative group flex items-center justify-center">
                <div className="absolute -inset-6 rounded-full bg-[#00C9A7]/25 blur-2xl group-hover:bg-[#00C9A7]/40 transition-all duration-500" />
                <UrboLogo
                  size={96}
                  className="relative transition-transform duration-500 group-hover:scale-105 shadow-[0_0_35px_rgba(0,201,167,0.5)]"
                />
              </div>

              <h3 className="font-tech text-3xl sm:text-4xl font-black text-white tracking-[0.25em] uppercase mt-4 leading-none">
                URBO
              </h3>
              <p className="text-xs sm:text-sm font-mono tracking-[0.3em] text-[#00E5BE] uppercase mt-2 font-bold">
                SANTA CRUZ DE LA SIERRA · BOLIVIA
              </p>
              <div className="text-[11px] font-mono text-slate-400 mt-2.5 font-sans">
                Mapeo en vivo · Aviso por voz a 300m · Red Troncal
              </div>
            </div>

            {/* Bottom Row: Location & Mandatory "Contáctanos" Trigger */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-slate-300 gap-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00E5BE]" />
                <span className="text-[11px]">Casco Viejo a 4to Anillo (5.04 km)</span>
              </div>

              <button
                type="button"
                onClick={toggleHologram}
                className="flex items-center gap-2 text-slate-950 font-bold transition-all bg-[#00C9A7] hover:bg-[#00E5BE] px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(0,201,167,0.5)] hover:shadow-[0_0_30px_rgba(0,229,190,0.8)] hover:scale-105 active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProjected ? 'Cerrar canales' : 'Contáctanos'}</span>
              </button>
            </div>

          </div>

          {/* Downward Laser Emitter Beam to Social Satellite (Desktop) */}
          <div
            ref={socialBeamRef}
            aria-hidden="true"
            className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-[2.5px] h-9 bg-gradient-to-b from-[#00E5BE] to-transparent shadow-[0_0_15px_#00E5BE] z-20 origin-top pointer-events-none"
          />

          {/* =============================================================
              4. SOCIAL SATELLITE PROJECTION: INSTAGRAM OFICIAL
              ============================================================= */}
          <div
            ref={socialPanelRef}
            className="w-full max-w-sm lg:w-[380px] lg:absolute lg:top-[calc(100%+2.2rem)] lg:left-1/2 lg:-translate-x-1/2 z-30 mt-4 lg:mt-0 rounded-3xl p-5 bg-gradient-to-b from-[#0F1C35]/96 via-[#0B1426]/96 to-[#070B14]/96 border-2 border-pink-500/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(225,48,108,0.25),inset_0_0_20px_rgba(225,48,108,0.12)] text-left relative star-wars-hologram overflow-hidden"
          >
            {/* Specular sheen sweep */}
            <div className="holo-specular-sweep pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-pink-500/30 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-pink-400 uppercase font-tech">
                  CANAL COMUNITARIO · 03
                </span>
              </div>
              <button
                type="button"
                onClick={closeHologram}
                className="lg:hidden p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Channel Body */}
            <a
              href="https://www.instagram.com/urbo.corp/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Instagram className="w-5 h-5 fill-current stroke-none" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-pink-300 block uppercase font-bold">
                    Instagram Oficial
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition-colors font-mono">
                    @urbo.corp
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-mono text-pink-400 group-hover:underline">
                <span>Ver perfil</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </a>

            {/* Footer status */}
            <div className="relative z-10 pt-2.5 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span className="text-slate-400">Avances del piloto & comunidad</span>
              <span className="text-pink-400 font-bold">@urbo.corp</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FinalCta;
