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
  ShieldCheck,
  Compass
} from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { UrboNavMap3D } from './UrboNavMap3D';
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
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          // 4 Chapter landmarks
          // 0: Catedral Metropolitana (0% - 25%)
          // 1: Av. Monseñor Rivero / René Moreno (25% - 55%)
          // 2: Monumento Cristo Redentor (55% - 80%)
          // 3: Corredor Norte / Handoff a Producto (80% - 100%)
          if (p < 0.25) setActiveChapter(0);
          else if (p < 0.55) setActiveChapter(1);
          else if (p < 0.80) setActiveChapter(2);
          else setActiveChapter(3);
        },
      });

      // Chapter 0 (Main Title): Tilts into the street pavement as scroll begins
      gsap.fromTo(
        '.hero-title-group',
        { opacity: 1, y: 0, scale: 1, rotateX: 0 },
        {
          opacity: 0,
          y: -110,
          scale: 0.90,
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

      // Chapter 1 Reveal: Casco Viejo & Av. Monseñor Rivero (22% - 48%)
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
            end: '36% top',
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
          start: '44% top',
          end: '53% top',
          scrub: true,
        },
      });

      // Chapter 2 Reveal: Monumento Cristo Redentor (52% - 78%)
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
            end: '66% top',
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
          start: '73% top',
          end: '82% top',
          scrub: true,
        },
      });

      // Chapter 3 Reveal: Corredor Norte & CTA Handoff (80% - 100%)
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
            start: '80% top',
            end: '95% top',
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
      style={{ height: '380vh' }}
    >
      {/* Pinned Cinematic Stage (100dvh sticky) */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-[#070B14] flex flex-col justify-between select-none"
      >
        {/* MapLibre GL 3D Urban Navigation Canvas (Google Maps 3D style) */}
        <UrboNavMap3D scrollProgress={scrollProgress} />

        {/* Top Scrim Gradient */}
        <div
          className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#070B14] via-[#070B14]/85 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Bottom Scrim Gradient */}
        <div
          className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#070B14] to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* HUD Telemetry Top Bar */}
        <div className="relative z-20 pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex justify-between items-start pointer-events-none">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B1426]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200 shadow-xl pointer-events-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="text-[#38BDF8] font-bold font-tech tracking-wider">LÍNEA 30</span>
            <span className="text-white/20">|</span>
            <span className="text-white/90">CATEDRAL → CRISTO REDENTOR → NORTE</span>
          </div>

          {/* Chapter Progression Tracker */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1426]/85 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70 pointer-events-auto">
            <Compass className="w-3.5 h-3.5 text-[#00E5BE]" />
            <span className="text-[#00E5BE] font-bold font-tech tracking-wider">
              {activeChapter === 0 && 'CATEDRAL METROPOLITANA'}
              {activeChapter === 1 && 'MONSEÑOR RIVERO'}
              {activeChapter === 2 && 'CRISTO REDENTOR'}
              {activeChapter === 3 && 'CORREDOR NORTE'}
            </span>
            <span className="text-white/20">·</span>
            <span>0{activeChapter + 1}/04</span>
          </div>
        </div>

        {/* Dynamic Center Stage Overlays (Narrative Chapters) */}
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center px-4 md:px-8 text-center pointer-events-none">
          {/* Chapter 0: Editorial Hero Headline with SD Dystopian Cyberpunk Brand */}
          <div className="hero-title-group max-w-3xl flex flex-col items-center -mt-6 sm:-mt-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00C9A7]/10 border border-[#00C9A7]/30 text-[#00E5BE] text-xs font-mono font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CIUDAD 3D EN TIEMPO REAL · SANTA CRUZ</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-4">
              Tu micro.{' '}
              <span className="font-tech text-transparent bg-clip-text bg-gradient-to-r from-[#00E5BE] via-[#38BDF8] to-[#00E5BE] tracking-wider uppercase font-black">
                EN TIEMPO REAL.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-light leading-relaxed mb-6 font-sans">
              URBO conecta la movilidad urbana de Santa Cruz con información accesible para pasajeros, choferes y líneas de transporte.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 animate-bounce">
              <ChevronDown className="w-4 h-4 text-[#38BDF8]" />
              <span>Desplaza hacia abajo para iniciar el recorrido</span>
            </div>
          </div>

          {/* Chapter 1 Card: La Incertidumbre & Casco Viejo (Docked Left to leave 3D street & beacon open) */}
          <div className="chapter-card-1 absolute left-4 sm:left-8 md:left-12 lg:left-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0B1426]/92 backdrop-blur-xl border border-white/10 text-left shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#F4C430] flex items-center gap-1.5 font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>01 · PLAZA 24 DE SEPTIEMBRE</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">Casco Viejo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
              Esperar a ciegas en la esquina cuesta 35 minutos al día.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              El 83% de los pasajeros en Santa Cruz no tiene certeza sobre el paso de su línea. La ruta inicia frente a la Catedral Metropolitana de San Lorenzo conectando hacia el norte.
            </p>
          </div>

          {/* Chapter 2 Card: Monumento Cristo Redentor (Docked Left to leave 3D street & beacon open) */}
          <div className="chapter-card-2 absolute left-4 sm:left-8 md:left-12 lg:left-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0B1426]/92 backdrop-blur-xl border border-[#00E5BE]/40 text-left shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#00E5BE] flex items-center gap-1.5 font-bold">
                <Radio className="w-3.5 h-3.5" />
                <span>02 · MONUMENTO CRISTO REDENTOR</span>
              </span>
              <span className="text-xs text-[#38BDF8] font-mono font-bold">2do Anillo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
              Telemetría audible en el nudo vial de la ciudad.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4 font-sans">
              El chofer no toca pantallas mientras conduce. Una alerta audible anuncia paradas y concentración de pasajeros con aviso a 300 metros.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-3 py-1.5 rounded-lg border border-[#38BDF8]/20">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Int. 32 Don Neyer cruzando Av. Monseñor Rivero</span>
            </div>
          </div>

          {/* Chapter 3 Card: Corredor Norte & CTA Handoff (80% - 100%) */}
          <div className="chapter-card-3 absolute max-w-lg w-full p-8 rounded-3xl bg-gradient-to-b from-[#0F1C35] to-[#070B14] backdrop-blur-2xl border border-[#00E5BE]/40 text-center shadow-2xl pointer-events-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C9A7]/20 text-[#00E5BE] text-xs font-mono font-bold tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CORREDOR NORTE INTEGRADO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Una red viva de transporte para toda Bolivia.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
              140 choferes, 1.239 usuarios y 5 meses de pruebas en la Línea 30 demostraron que la tecnología simple resuelve problemas reales de movilidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#oportunidad"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00C9A7] hover:bg-[#00E5BE] text-[#070B14] font-semibold text-sm transition-all shadow-lg hover:shadow-[#00C9A7]/30 active:scale-95"
              >
                <span>Descubre cómo funciona URBO</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#162040]/80 hover:bg-[#1E2D52] text-white font-medium text-sm border border-white/10 transition-colors"
              >
                <span>Contáctanos</span>
              </a>
            </div>
          </div>
        </div>

        {/* HUD Bottom Status Bar */}
        <div className="relative z-20 pb-6 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-slate-400 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
            <span>ESTADO: RUTA LÍNEA 30 ACTIVA · CORREDOR URBANO SCZ</span>
          </div>

          {/* Scrub Progress Bar */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00C9A7] via-[#00E5BE] to-[#38BDF8] transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-[#38BDF8] font-bold">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CinematicHero;
