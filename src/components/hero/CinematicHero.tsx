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
  Compass,
  Sun,
  Moon,
  Clock,
  Users,
  CheckCircle2
} from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { UrboNavMap3D, UrboNavMap3DHandle } from './UrboNavMap3D';
import { DayNightVisuals, getDayNightVisuals } from './SantaCruzNavData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CinematicHero: React.FC = () => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mapHandleRef = useRef<UrboNavMap3DHandle>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const distanceTextRef = useRef<HTMLSpanElement>(null);
  const currentChapterRef = useRef<number>(0);

  const [activeChapter, setActiveChapter] = useState(0);
  const [timeLabel, setTimeLabel] = useState('DÍA · 14:30');
  const [dayNightState, setDayNightState] = useState<DayNightVisuals>(() => getDayNightVisuals(0));

  // Handler for dynamic time updates from the 3D map engine (discrete, avoids unnecessary re-renders)
  const handleTimeChange = (visuals: DayNightVisuals) => {
    setTimeLabel((prev) => (prev !== visuals.timeOfDayLabel ? visuals.timeOfDayLabel : prev));
    setDayNightState((prev) => (prev.timeOfDayLabel !== visuals.timeOfDayLabel ? visuals : prev));
  };

  // Setup GSAP ScrollTrigger timeline to scrub the 3D scene & 5 narrative chapters at 120 FPS
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
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;

          // Direct imperative map scrub (zero React virtual DOM re-renders during high-speed scrolling)
          mapHandleRef.current?.setProgress(p);

          // Direct DOM updates for telemetry HUD
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${Math.round(p * 100)}%`;
          }
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
          }
          if (distanceTextRef.current) {
            const km = ((p * 5041.8) / 1000).toFixed(2);
            distanceTextRef.current.textContent = `DISTANCIA EN RUTA: ${km} KM / 5.04 KM · SCZ TRONCAL`;
          }

          // Discrete Chapter Milestones:
          // 0: Catedral Metropolitana (0% - 18%) -> 0m to 900m
          // 1: Plaza del Estudiante & 1er Anillo (18% - 38%) -> 900m to 1,900m
          // 2: Monumento Cristo Redentor (38% - 60%) -> 1,900m to 3,000m
          // 3: Corredor Norte & 3er Anillo (60% - 82%) -> 3,000m to 4,100m
          // 4: Visión URBO & Cuarto Anillo (82% - 100%) -> 4,100m to 5,042m
          let chap = 0;
          if (p < 0.18) chap = 0;
          else if (p < 0.38) chap = 1;
          else if (p < 0.60) chap = 2;
          else if (p < 0.82) chap = 3;
          else chap = 4;

          if (chap !== currentChapterRef.current) {
            currentChapterRef.current = chap;
            setActiveChapter(chap);
          }
        },
      });

      // Chapter 0 (Main Title): Soft fade and rise as scroll starts
      gsap.fromTo(
        '.hero-title-group',
        { opacity: 1, y: 0, scale: 1 },
        {
          opacity: 0,
          y: -90,
          scale: 0.92,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: runway,
            start: 'top top',
            end: '15% top',
            scrub: true,
          },
        }
      );

      // Chapter 1 Reveal (LEFT): Plaza del Estudiante (16% - 37%)
      gsap.fromTo(
        '.chapter-card-1',
        { opacity: 0, x: -35, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '16% top',
            end: '25% top',
            scrub: true,
          },
        }
      );
      gsap.to('.chapter-card-1', {
        opacity: 0,
        y: -35,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: runway,
          start: '32% top',
          end: '37% top',
          scrub: true,
        },
      });

      // Chapter 2 Reveal (RIGHT): Monumento Cristo Redentor (38% - 59%)
      gsap.fromTo(
        '.chapter-card-2',
        { opacity: 0, x: 35, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '38% top',
            end: '47% top',
            scrub: true,
          },
        }
      );
      gsap.to('.chapter-card-2', {
        opacity: 0,
        y: -35,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: runway,
          start: '54% top',
          end: '59% top',
          scrub: true,
        },
      });

      // Chapter 3 Reveal (LEFT): Corredor Norte & Evidencia del Piloto (60% - 81%)
      gsap.fromTo(
        '.chapter-card-3',
        { opacity: 0, x: -35, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '60% top',
            end: '69% top',
            scrub: true,
          },
        }
      );
      gsap.to('.chapter-card-3', {
        opacity: 0,
        y: -35,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: runway,
          start: '76% top',
          end: '81% top',
          scrub: true,
        },
      });

      // Chapter 4 Reveal (CENTER FINALE): Visión de URBO & Cuarto Anillo (82% - 100%)
      gsap.fromTo(
        '.chapter-card-4',
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '82% top',
            end: '93% top',
            scrub: true,
          },
        }
      );
    }, runway);

    return () => ctx.revert();
  }, []);

  // Compute dynamic atmosphere styling based on day/night progress
  const dnProgress = dayNightState.dayNightProgress;
  const isDayOrAfternoon = dnProgress < 0.65;

  return (
    <div
      ref={runwayRef}
      id="inicio"
      className="relative w-full"
      style={{ height: '500vh' }}
    >
      {/* Pinned Cinematic Stage (100dvh sticky) */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex flex-col justify-between select-none transition-colors duration-700 bg-[#070B14]"
        style={{
          backgroundColor: dayNightState.backgroundColor,
        }}
      >
        {/* MapLibre GL 3D Urban Navigation Canvas (Imperative Ref for 120 FPS Buttery Scroll) */}
        <UrboNavMap3D
          ref={mapHandleRef}
          onTimeChange={handleTimeChange}
        />

        {/* Dynamic Top Scrim (Crisp dark vignette, zero white haze) */}
        <div
          className="absolute top-0 inset-x-0 h-44 pointer-events-none z-10 transition-all duration-700"
          style={{
            background: 'linear-gradient(to bottom, rgba(7, 11, 20, 0.92) 0%, rgba(7, 11, 20, 0.40) 60%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Dynamic Bottom Scrim (Crisp dark vignette, zero milky scrim) */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10 transition-all duration-700"
          style={{
            background: 'linear-gradient(to top, rgba(7, 11, 20, 0.95) 0%, rgba(7, 11, 20, 0.45) 60%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* HUD Telemetry Top Bar */}
        <div className="relative z-20 pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex justify-between items-start pointer-events-none">
          {/* Corridor & Micro Tracking Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B1426]/90 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200 shadow-xl pointer-events-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="text-[#38BDF8] font-bold font-tech tracking-wider">LÍNEA 30</span>
            <span className="text-white/20">|</span>
            <span className="text-white/90 hidden sm:inline">CATEDRAL → CRISTO REDENTOR → 4TO ANILLO</span>
            <span className="text-white/90 sm:hidden">5.0 KM CORREDOR SCZ</span>
          </div>

          {/* Time of Day & Chapter Progression Tracker */}
          <div className="flex items-center gap-2.5 pointer-events-auto">
            {/* Dynamic Day/Night Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1426]/90 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80 shadow-lg">
              {isDayOrAfternoon ? (
                <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#38BDF8]" />
              )}
              <span className="font-bold text-amber-300 font-tech tracking-wider">
                {timeLabel}
              </span>
            </div>

            {/* Chapter Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1426]/90 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70 shadow-lg">
              <Compass className="w-3.5 h-3.5 text-[#00E5BE]" />
              <span className="text-[#00E5BE] font-bold font-tech tracking-wider">
                {activeChapter === 0 && 'CATEDRAL'}
                {activeChapter === 1 && 'PLAZA DEL ESTUDIANTE'}
                {activeChapter === 2 && 'CRISTO REDENTOR'}
                {activeChapter === 3 && 'CORREDOR NORTE'}
                {activeChapter === 4 && 'VISIÓN URBO'}
              </span>
              <span className="text-white/20">·</span>
              <span>0{activeChapter + 1}/05</span>
            </div>
          </div>
        </div>

        {/* Dynamic Center Stage Overlays (5 Narrative Chapters with Alternating Layout) */}
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center px-4 md:px-8 text-center pointer-events-none">
          
          {/* Chapter 0: Editorial Hero Headline (Catedral Metropolitana · 0% - 18%) */}
          <div className="hero-title-group max-w-3xl flex flex-col items-center -mt-6 sm:-mt-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00C9A7]/15 border border-[#00C9A7]/30 text-[#00E5BE] text-xs font-mono font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CIUDAD 3D EN TIEMPO REAL · SANTA CRUZ</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-4">
              Tu micro.{' '}
              <span className="font-tech text-transparent bg-clip-text bg-gradient-to-r from-[#00E5BE] via-[#38BDF8] to-[#00E5BE] tracking-wider uppercase font-black">
                EN TIEMPO REAL.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-xl font-light leading-relaxed mb-6 font-sans">
              URBO conecta la movilidad urbana de Santa Cruz con información accesible para pasajeros, choferes y líneas de transporte.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 animate-bounce">
              <ChevronDown className="w-4 h-4 text-[#38BDF8]" />
              <span>Desplaza hacia abajo para iniciar el recorrido</span>
            </div>
          </div>

          {/* Chapter 1 Card (LEFT): Plaza del Estudiante & Reducción de Incertidumbre (18% - 38%) */}
          <div className="chapter-card-1 absolute left-4 sm:left-8 md:left-12 lg:left-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0B1426]/94 backdrop-blur-xl border border-white/15 text-left shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#F4C430] flex items-center gap-1.5 font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>02 · PLAZA DEL ESTUDIANTE</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">1er Anillo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
              Consultar la ubicación exacta elimina la espera a ciegas.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
              En Santa Cruz, los pasajeros pierden más de 35 minutos al día sin saber cuándo pasará su micro. URBO ofrece visibilidad directa del trayecto para tomar decisiones informadas antes de salir.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#00E5BE] bg-[#00C9A7]/10 px-2.5 py-1 rounded-md border border-[#00C9A7]/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acceso directo sin descargas pesadas</span>
            </div>
          </div>

          {/* Chapter 2 Card (RIGHT): Monumento Cristo Redentor & Choferes (38% - 60%) */}
          <div className="chapter-card-2 absolute right-4 sm:right-8 md:right-12 lg:right-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0B1426]/94 backdrop-blur-xl border border-[#00E5BE]/40 text-left shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#00E5BE] flex items-center gap-1.5 font-bold">
                <Radio className="w-3.5 h-3.5" />
                <span>03 · MONUMENTO CRISTO REDENTOR</span>
              </span>
              <span className="text-xs text-[#38BDF8] font-mono font-bold">2do Anillo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
              Telemetría manos libres que cuida la conducción.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4 font-sans">
              El chofer no toca pantallas al volante. Una alerta por voz anuncia paradas clave a 300 metros, y la función <span className="text-[#00E5BE] font-semibold">Esperar Aquí</span> (en desarrollo) anticipa la demanda de pasajeros en ruta.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-3 py-1.5 rounded-lg border border-[#38BDF8]/20">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Int. 32 Don Neyer cruzando la rotonda central</span>
            </div>
          </div>

          {/* Chapter 3 Card (LEFT): Corredor Norte & Evidencia del Piloto (60% - 82%) */}
          <div className="chapter-card-3 absolute left-4 sm:left-8 md:left-12 lg:left-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0B1426]/94 backdrop-blur-xl border border-[#38BDF8]/50 text-left shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#38BDF8] flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>04 · CORREDOR NORTE · EVIDENCIA</span>
              </span>
              <span className="text-xs text-[#F4C430] font-mono font-bold">3er Anillo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
              5 meses de pruebas con datos reales en la Línea 30.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4 font-sans">
              La tecnología simple resuelve problemas reales cuando se construye junto a la comunidad:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-200">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-[#00E5BE] font-bold text-sm block">140</span>
                <span>Usuarios piloto</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-[#38BDF8] font-bold text-sm block">1.239</span>
                <span>Mensajes analizados</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-[#F4C430] font-bold text-sm block">83</span>
                <span>Remitentes activos</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-white font-bold text-sm block">Línea 30</span>
                <span>Corredor validado</span>
              </div>
            </div>
          </div>

          {/* Chapter 4 Card (CENTER FINALE): Visión de URBO & Cuarto Anillo Handoff (82% - 100%) */}
          <div className="chapter-card-4 absolute inset-x-4 max-w-lg w-full bottom-20 md:bottom-28 mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#0F1C35] to-[#070B14] backdrop-blur-2xl border border-[#00E5BE]/40 text-center shadow-2xl pointer-events-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C9A7]/20 text-[#00E5BE] text-xs font-mono font-bold tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>05 · VISIÓN DE ESCALA · BOLIVIA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Una red viva de transporte para toda Bolivia.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
              Nuestro objetivo es ampliar la cobertura a todas las líneas y ciudades del país, creando una infraestructura de movilidad abierta, digna y predecible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#oportunidad"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00C9A7] hover:bg-[#00E5BE] text-[#070B14] font-semibold text-sm transition-all shadow-lg hover:shadow-[#00C9A7]/30 active:scale-95"
              >
                <span>Descubre la Solución</span>
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
        <div className="relative z-20 pb-6 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-slate-300 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
            <span ref={distanceTextRef}>
              DISTANCIA EN RUTA: 0.00 KM / 5.04 KM · SCZ TRONCAL
            </span>
          </div>

          {/* Scrub Progress Bar */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-[#00C9A7] via-[#00E5BE] to-[#38BDF8] transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>
            <span ref={progressTextRef} className="text-[10px] text-[#38BDF8] font-bold">
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
