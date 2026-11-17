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
  const [timeLabel, setTimeLabel] = useState('MAÑANA · 08:30');
  const [dayNightState, setDayNightState] = useState<DayNightVisuals>(() => getDayNightVisuals(0));

  // Handler for dynamic time updates from the 3D map engine (discrete, avoids unnecessary re-renders)
  const handleTimeChange = (visuals: DayNightVisuals) => {
    setTimeLabel((prev) => (prev !== visuals.timeOfDayLabel ? visuals.timeOfDayLabel : prev));
    setDayNightState((prev) => (prev.timeOfDayLabel !== visuals.timeOfDayLabel ? visuals : prev));
  };

  // Setup GSAP ScrollTrigger timeline to scrub the 3D scene & narrative chapters at 120 FPS
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
            const km = ((p * 7530) / 1000).toFixed(2);
            distanceTextRef.current.textContent = `DISTANCIA EN RUTA: ${km} KM / 7.53 KM · SCZ METROPOLITANO`;
          }

          // Discrete Chapter Milestones:
          // 0: Introducción & Casco Viejo (0% - 15%)
          // 1: Acceso a la Información / 1er Anillo (15% - 36%)
          // 2: Conducción Segura / 2do Anillo (36% - 59%)
          // 3: Validación Comunitaria / 3er Anillo (59% - 82%)
          // 4: Visión de Escala Bolivia / 4to Anillo (82% - 100%)
          let chap = 0;
          if (p < 0.15) chap = 0;
          else if (p < 0.36) chap = 1;
          else if (p < 0.59) chap = 2;
          else if (p < 0.82) chap = 3;
          else chap = 4;

          if (chap !== currentChapterRef.current) {
            currentChapterRef.current = chap;
            setActiveChapter(chap);
          }
        },
      });

      // Chapter 0 (Main Welcome Title): Soft fade and rise, completely hidden by 12%
      gsap.fromTo(
        '.hero-title-group',
        { opacity: 1, y: 0, scale: 1 },
        {
          opacity: 0,
          y: -70,
          scale: 0.94,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: runway,
            start: 'top top',
            end: '12% top',
            scrub: true,
            onLeave: () => gsap.set('.hero-title-group', { display: 'none' }),
            onEnterBack: () => gsap.set('.hero-title-group', { display: 'flex' }),
          },
        }
      );

      // Chapter 1 Reveal (LEFT): Acceso a la Información (15% - 35%)
      gsap.fromTo(
        '.chapter-card-1',
        { autoAlpha: 0, x: -40, scale: 0.95 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '15% top',
            end: '24% top',
            scrub: true,
          },
        }
      );
      gsap.to('.chapter-card-1', {
        autoAlpha: 0,
        y: -30,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: runway,
          start: '31% top',
          end: '35% top',
          scrub: true,
        },
      });

      // Chapter 2 Reveal (RIGHT): Conducción Segura (38% - 58%)
      gsap.fromTo(
        '.chapter-card-2',
        { autoAlpha: 0, x: 40, scale: 0.95 },
        {
          autoAlpha: 1,
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
        autoAlpha: 0,
        y: -30,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: runway,
          start: '54% top',
          end: '58% top',
          scrub: true,
        },
      });

      // Chapter 3 Reveal (LEFT): Validación en Calle (61% - 81%)
      gsap.fromTo(
        '.chapter-card-3',
        { autoAlpha: 0, x: -40, scale: 0.95 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '61% top',
            end: '70% top',
            scrub: true,
          },
        }
      );
      gsap.to('.chapter-card-3', {
        autoAlpha: 0,
        y: -30,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: runway,
          start: '77% top',
          end: '81% top',
          scrub: true,
        },
      });

      // Chapter 4 Reveal (RIGHT): Visión de Escala Bolivia (84% - 100%)
      gsap.fromTo(
        '.chapter-card-4',
        { autoAlpha: 0, x: 40, scale: 0.95 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: runway,
            start: '84% top',
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
      style={{ height: '750vh' }}
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

        {/* Dynamic Top Scrim (Transitions smoothly from morning atmosphere to dark navy) */}
        <div
          className="absolute top-0 inset-x-0 h-44 pointer-events-none z-10 transition-all duration-700"
          style={{
            background: dayNightState.scrimTop,
          }}
          aria-hidden="true"
        />

        {/* Dynamic Bottom Scrim */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10 transition-all duration-700"
          style={{
            background: dayNightState.scrimBottom,
          }}
          aria-hidden="true"
        />

        {/* Clean Editorial Top Bar (Zero technical dashboard noise) */}
        <div className="relative z-20 pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex justify-between items-start pointer-events-none">
          {/* Subtle Location Identity */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#070E1E]/92 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200 shadow-xl pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" />
            <span className="text-white/90 font-medium tracking-wide">Santa Cruz de la Sierra</span>
          </div>

          {/* Time of Day Tracker */}
          <div className="flex items-center gap-2.5 pointer-events-auto">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070E1E]/92 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/90 shadow-lg">
              {isDayOrAfternoon ? (
                <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#38BDF8]" />
              )}
              <span className="font-bold text-amber-300 font-tech tracking-wider">
                {timeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Center Stage Overlays (Editorial Introduction & Strictly Lateral Chapters) */}
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center px-4 md:px-8 text-center pointer-events-none">
          
          {/* Chapter 0: Editorial Welcome Headline (0% - 12%) */}
          <div className="hero-title-group max-w-3xl flex flex-col items-center -mt-8 sm:-mt-14 pointer-events-auto select-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#060B18]/98 border border-white/20 text-[#00E5BE] text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_15px_35px_rgba(0,0,0,0.85)] text-center">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5BE] shrink-0" />
              <span>BIENVENIDO A URBO, DÉJANOS CONTARTE MÁS ACERCA DE NOSOTROS Y NUESTRA MISIÓN</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-4 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
              Tu micro.{' '}
              <span className="font-tech text-transparent bg-clip-text bg-gradient-to-r from-[#00E5BE] via-[#38BDF8] to-[#00E5BE] tracking-wider uppercase font-black">
                EN TIEMPO REAL.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-100 max-w-xl font-normal leading-relaxed mb-6 font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] bg-[#060B18]/95 px-6 py-3 rounded-2xl border border-white/15 shadow-2xl">
              Conectamos el transporte público de Santa Cruz con información accesible y transparente para pasajeros, choferes y líneas urbanas.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-200 bg-[#060B18]/95 px-4 py-2 rounded-full border border-white/20 animate-bounce shadow-xl">
              <ChevronDown className="w-4 h-4 text-[#38BDF8]" />
              <span>Desplaza hacia abajo para iniciar el recorrido</span>
            </div>
          </div>

          {/* Chapter 1 Card (LEFT): Acceso a la Información & Reducción de Incertidumbre (15% - 35%) */}
          <div className="chapter-card-1 absolute left-4 sm:left-8 md:left-12 lg:left-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#060B18]/98 border border-white/20 text-left shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.8)] pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#F4C430] flex items-center gap-1.5 font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>01 · ACCESO A LA INFORMACIÓN</span>
              </span>
              <span className="text-[11px] font-mono text-slate-300">Casco Viejo & 1er Anillo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-md">
              Consultar la ubicación exacta elimina la espera a ciegas.
            </h2>
            <p className="text-sm text-slate-100 leading-relaxed font-sans mb-3.5">
              En Santa Cruz, los pasajeros pierden más de 35 minutos al día sin saber cuándo pasará su micro. URBO ofrece visibilidad directa del trayecto para tomar decisiones informadas antes de salir.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#00E5BE] bg-[#00C9A7]/15 px-3 py-1.5 rounded-lg border border-[#00C9A7]/30 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acceso directo sin descargas pesadas</span>
            </div>
          </div>

          {/* Chapter 2 Card (RIGHT): Conducción Segura Manos Libres (38% - 58%) */}
          <div className="chapter-card-2 absolute right-4 sm:right-8 md:right-12 lg:right-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#060B18]/98 border border-white/20 text-left shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.8)] pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#00E5BE] flex items-center gap-1.5 font-bold">
                <Radio className="w-3.5 h-3.5" />
                <span>02 · CONDUCCIÓN SEGURA</span>
              </span>
              <span className="text-xs text-[#38BDF8] font-mono font-bold">2do Anillo & Cristo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-md">
              Telemetría manos libres que cuida la conducción.
            </h2>
            <p className="text-sm text-slate-100 leading-relaxed mb-4 font-sans">
              El chofer no toca pantallas al volante. Una alerta por voz anuncia hitos clave a 300 metros, y la función <span className="text-[#00E5BE] font-semibold">Esperar Aquí</span> anticipa la demanda de pasajeros en ruta.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/15 px-3 py-1.5 rounded-lg border border-[#38BDF8]/30 font-medium">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Asistencia auditiva pasiva en cabina</span>
            </div>
          </div>

          {/* Chapter 3 Card (LEFT): Validación Comunitaria en Calle (61% - 81%) */}
          <div className="chapter-card-3 absolute left-4 sm:left-8 md:left-12 lg:left-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#060B18]/98 border border-white/20 text-left shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.8)] pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#38BDF8] flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>03 · VALIDACIÓN EN CALLE</span>
              </span>
              <span className="text-xs text-[#F4C430] font-mono font-bold">3er Anillo & Equipetrol</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-md">
              5 meses de pruebas continuas con datos reales.
            </h2>
            <p className="text-sm text-slate-100 leading-relaxed mb-4 font-sans">
              La tecnología simple resuelve problemas reales cuando se construye junto a la comunidad:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-200">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[#00E5BE] font-bold text-base block font-tech">140</span>
                <span>Usuarios piloto</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[#38BDF8] font-bold text-base block font-tech">1.239</span>
                <span>Mensajes analizados</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[#F4C430] font-bold text-base block font-tech">83</span>
                <span>Remitentes activos</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-white font-bold text-base block font-tech">7.5 KM</span>
                <span>Corredor validado</span>
              </div>
            </div>
          </div>

          {/* Chapter 4 Card (RIGHT): Visión de Escala Bolivia (84% - 100%) */}
          <div className="chapter-card-4 absolute right-4 sm:right-8 md:right-12 lg:right-16 bottom-20 md:bottom-28 max-w-sm sm:max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#060B18]/98 border border-white/20 text-left shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.8)] pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#00E5BE] flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>04 · VISIÓN DE ESCALA · BOLIVIA</span>
              </span>
              <span className="text-xs text-[#38BDF8] font-mono font-bold">4to & 5to Anillo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-md">
              Una red viva de transporte para toda Bolivia.
            </h2>
            <p className="text-sm text-slate-100 leading-relaxed mb-5 font-sans">
              Nuestro objetivo es conectar la cobertura de micros en todas las ciudades del país, creando una infraestructura de movilidad abierta, digna y predecible.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href="#oportunidad"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00C9A7] hover:bg-[#00E5BE] text-[#070B14] font-semibold text-xs transition-all shadow-lg hover:shadow-[#00C9A7]/30 active:scale-95"
              >
                <span>Descubre la Solución</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#162040]/80 hover:bg-[#1E2D52] text-white font-medium text-xs border border-white/10 transition-colors"
              >
                <span>Contáctanos</span>
              </a>
            </div>
          </div>

        </div>

        {/* HUD Bottom Status Bar */}
        <div className="relative z-20 pb-6 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-slate-200 pointer-events-none">
          <div className="flex items-center gap-2 bg-[#060B18]/95 px-4 py-2 rounded-full border border-white/20 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" />
            <span ref={distanceTextRef} className="tracking-wide font-tech text-white">
              DISTANCIA EN RUTA: 0.00 KM / 7.53 KM · SCZ METROPOLITANO
            </span>
          </div>

          {/* Scrub Progress Bar */}
          <div className="flex items-center gap-3 w-full sm:w-64 bg-[#060B18]/95 px-4 py-2 rounded-full border border-white/20 shadow-xl">
            <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-[#00C9A7] via-[#00E5BE] to-[#38BDF8] transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>
            <span ref={progressTextRef} className="text-[10px] text-[#38BDF8] font-bold font-tech">
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
