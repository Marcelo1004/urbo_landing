import React, { useRef, useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Volume2, 
  Sparkles, 
  ChevronDown, 
  ArrowRight, 
  Radio, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { UrboCityScene3D } from './UrboCityScene3D';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CinematicHero: React.FC = () => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  // Setup GSAP ScrollTrigger timeline to scrub the 3D scene & narrative titles
  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: runway,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          // Update chapter thresholds
          if (p < 0.25) setActiveChapter(0);
          else if (p < 0.55) setActiveChapter(1);
          else if (p < 0.82) setActiveChapter(2);
          else setActiveChapter(3);
        },
      });

      // Chapter 0 (Main Title): Transforms down into the road plane as scroll begins
      gsap.fromTo(
        '.hero-title-group',
        { opacity: 1, y: 0, scale: 1, rotateX: 0 },
        {
          opacity: 0,
          y: -120,
          scale: 0.88,
          rotateX: 20,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: runway,
            start: 'top top',
            end: '22% top',
            scrub: true,
          },
        }
      );

      // Chapter 1 Reveal: La espera a ciegas
      gsap.fromTo(
        '.chapter-card-1',
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '20% top',
            end: '38% top',
            scrub: true,
          },
        }
      );
      gsap.to('.chapter-card-1', {
        opacity: 0,
        y: -40,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: runway,
          start: '45% top',
          end: '55% top',
          scrub: true,
        },
      });

      // Chapter 2 Reveal: Telemetría en cabina
      gsap.fromTo(
        '.chapter-card-2',
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '52% top',
            end: '68% top',
            scrub: true,
          },
        }
      );
      gsap.to('.chapter-card-2', {
        opacity: 0,
        y: -40,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: runway,
          start: '75% top',
          end: '84% top',
          scrub: true,
        },
      });

      // Chapter 3 Reveal: Destino & CTA
      gsap.fromTo(
        '.chapter-card-3',
        { opacity: 0, y: 60, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '82% top',
            end: '96% top',
            scrub: true,
          },
        }
      );
    }, runway);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={runwayRef}
      id="inicio"
      className="relative w-full"
      style={{ height: '360vh' }} // Extended runway for smooth scrubbing
    >
      {/* Pinned Cinematic Stage (100dvh sticky) */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-[#070B14] flex flex-col justify-between select-none"
      >
        {/* Three.js Nocturnal Isometric City Canvas */}
        <UrboCityScene3D scrollProgress={scrollProgress} />

        {/* Top Scrim Gradient (Protects Navbar readability) */}
        <div
          className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#070B14] via-[#070B14]/80 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Bottom Scrim Gradient (Blends into following sections) */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#070B14] to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* HUD Telemetry Top Bar */}
        <div className="relative z-20 pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex justify-between items-start pointer-events-none">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0F1D36]/80 backdrop-blur-md border border-[#1B2A47] text-xs font-mono text-[#FAF5EC]/90 shadow-lg pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="text-[#38BDF8] font-bold">LÍNEA 30</span>
            <span className="text-white/30">|</span>
            <span>CASCO VIEJO · SANTA CRUZ</span>
          </div>

          {/* Chapter Progression Tracker */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F1D36]/80 backdrop-blur-md border border-[#1B2A47] text-[11px] font-mono text-white/70 pointer-events-auto">
            <span className="text-[#10B981] font-semibold">CAPÍTULO 0{activeChapter + 1}</span>
            <span className="text-white/20">/</span>
            <span>04</span>
          </div>
        </div>

        {/* Dynamic Center Stage Overlays (Narrative Chapters) */}
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center px-4 md:px-8 text-center pointer-events-none">
          {/* Chapter 0: Editorial Hero Headline (Scrolls away into the city floor) */}
          <div className="hero-title-group max-w-3xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-medium mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CIUDAD 3D INTERACTIVA · SCROLL STORYTELLING</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-4">
              Tu micro.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#38BDF8] to-[#10B981]">
                EN TIEMPO REAL.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#FAF5EC]/80 max-w-xl font-light leading-relaxed mb-6">
              URBO conecta la movilidad urbana de Santa Cruz con información accesible para pasajeros, choferes y líneas de transporte.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-white/50 animate-bounce">
              <ChevronDown className="w-4 h-4 text-[#38BDF8]" />
              <span>Desplaza hacia abajo para iniciar el recorrido</span>
            </div>
          </div>

          {/* Chapter 1 Card: La Incertidumbre (20% - 45%) */}
          <div className="chapter-card-1 absolute max-w-md w-full p-6 rounded-2xl bg-[#0F1D36]/90 backdrop-blur-xl border border-[#1B2A47] text-left shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#F59E0B] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>01 · DIAGNÓSTICO URBANO</span>
              </span>
              <span className="text-xs text-white/40">Casco Viejo</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Esperar a ciegas en la esquina cuesta 35 minutos al día.
            </h2>
            <p className="text-sm text-[#FAF5EC]/70 leading-relaxed">
              El 83% de los pasajeros en Santa Cruz no tiene certeza sobre el paso de su línea. URBO digitaliza el recorrido sin alterar las costumbres del usuario.
            </p>
          </div>

          {/* Chapter 2 Card: Telemetría en Cabina (52% - 75%) */}
          <div className="chapter-card-2 absolute max-w-md w-full p-6 rounded-2xl bg-[#0F1D36]/90 backdrop-blur-xl border border-[#10B981]/40 text-left shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#10B981] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>02 · TELEMETRÍA EN CABINA</span>
              </span>
              <span className="text-xs text-[#38BDF8] font-mono">Int. 32 Don Neyer</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Avisos por voz a 300 metros, manos libres.
            </h2>
            <p className="text-sm text-[#FAF5EC]/70 leading-relaxed mb-4">
              El chofer no toca pantallas mientras conduce. Una alerta audible anuncia paradas y concentración de pasajeros en tiempo real.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-1 rounded-md border border-[#38BDF8]/20">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Beacon activo en René Moreno & Sucre</span>
            </div>
          </div>

          {/* Chapter 3 Card: Destino & CTA (82% - 100%) */}
          <div className="chapter-card-3 absolute max-w-lg w-full p-8 rounded-3xl bg-gradient-to-b from-[#102340] to-[#0B1526] backdrop-blur-2xl border border-[#10B981]/50 text-center shadow-2xl pointer-events-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VALIDACIÓN DE CAMPO COMPLETADA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Una red viva de transporte para toda Bolivia.
            </h2>
            <p className="text-sm text-[#FAF5EC]/80 leading-relaxed mb-6">
              140 choferes, 1.239 usuarios y 5 meses de pruebas en la Línea 30 demostraron que la tecnología simple resuelve problemas reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#oportunidad"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#070B14] font-semibold text-sm transition-all shadow-lg hover:shadow-[#10B981]/30 active:scale-95"
              >
                <span>Descubre cómo funciona URBO</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1B2A47]/60 hover:bg-[#1B2A47] text-white font-medium text-sm border border-white/10 transition-colors"
              >
                <span>Contáctanos</span>
              </a>
            </div>
          </div>
        </div>

        {/* HUD Bottom Status Bar */}
        <div className="relative z-20 pb-6 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-white/50 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>ESTADO: RUTA LÍNEA 30 ACTIVA · VELOCIDAD MEDIA 18 KM/H</span>
          </div>

          {/* Scrub Progress Bar */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#38BDF8] transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-[#38BDF8]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CinematicHero;
