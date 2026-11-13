import React, { useState, useRef, useEffect } from 'react';
import { 
  BellRing, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  LayoutDashboard, 
  Volume2, 
  Smartphone, 
  Check, 
  ArrowRight,
  Navigation
} from 'lucide-react';
import { GlassSurface, GlassBadge, GlassButton, OpticalGlass, LiquidGlass } from '@/components/ui/Glass';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

export const Solution: React.FC = () => {
  const [voiceTesting, setVoiceTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'esperar' | 'rutas' | 'seguridad'>('esperar');
  const sectionRef = useRef<HTMLElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  const handleTestVoice = () => {
    setVoiceTesting(true);
    setTimeout(() => setVoiceTesting(false), 2400);
  };

  // Tab transition using GSAP (pure transform & opacity)
  const handleTabChange = (newTab: 'esperar' | 'rutas' | 'seguridad') => {
    if (newTab === activeTab) return;
    if (tabContentRef.current) {
      gsap.to(tabContentRef.current, {
        opacity: 0,
        y: -6,
        duration: motion.duration.micro,
        ease: motion.ease.exit,
        onComplete: () => {
          setActiveTab(newTab);
          gsap.fromTo(
            tabContentRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: motion.duration.fast, ease: motion.ease.enter }
          );
        },
      });
    } else {
      setActiveTab(newTab);
    }
  };

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.solution-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: motion.duration.normal,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.solution-hero-glass',
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: motion.duration.normal,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: '.solution-hero-glass',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.solution-pillar-card',
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: motion.duration.normal,
          stagger: 0.08,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: '.solution-pillars-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="solucion" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Anchor alias */}
      <span id="como-funciona" className="absolute -top-32" />

      {/* Atmospheric lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-urbo-teal/15 blur-[170px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -left-32 w-[550px] h-[550px] rounded-full bg-urbo-amber/10 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="solution-header max-w-3xl mb-14 sm:mb-16">
          <GlassBadge variant="teal" className="mb-5">
            TECNOLOGÍA DE MOVILIDAD
          </GlassBadge>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-5 font-tech">
            Menos tiempo en la esquina.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
              Más control en tu viaje.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Una plataforma diseñada para la realidad urbana de Santa Cruz: simple para el pasajero, segura y con manos libres para el chofer, y transparente para las líneas.
          </p>
        </div>

        {/* =================================================================
            HERO INNOVATION SHOWCASE: MODO "ESPERAR AQUÍ" (WITH GSAP TABS)
            ================================================================= */}
        <div className="solution-hero-glass">
          <GlassSurface
            variant="amber"
            specular
            className="p-6 sm:p-10 mb-14 relative overflow-hidden"
          >
            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-2 mb-8 bg-black/10 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 dark:border-white/10 w-fit">
              <button
                type="button"
                onClick={() => handleTabChange('esperar')}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all',
                  activeTab === 'esperar'
                    ? 'bg-urbo-amber text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                Modo Esperar Aquí
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('rutas')}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all',
                  activeTab === 'rutas'
                    ? 'bg-urbo-amber text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                Telemetría 300m
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('seguridad')}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all',
                  activeTab === 'seguridad'
                    ? 'bg-urbo-amber text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                Cero Distracciones
              </button>
            </div>

            <div ref={tabContentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left: Explanation */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-urbo-amber/15 border border-urbo-amber/30 text-amber-700 dark:text-urbo-amber text-xs font-mono font-bold tracking-wider uppercase mb-5">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>INNOVACIÓN EXCLUSIVA DE URBO</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                  {activeTab === 'esperar' && 'Modo "Esperar Aquí"'}
                  {activeTab === 'rutas' && 'Alerta Acústica a 300 Metros'}
                  {activeTab === 'seguridad' && 'Conducción 100% Segura'}
                </h3>

                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                  {activeTab === 'esperar' &&
                    'El pasajero toca un botón en su celular al llegar a la parada. El chofer recibe una alerta de voz nítida y automática exactamente a 300 metros de distancia:'}
                  {activeTab === 'rutas' &&
                    'La antena GPS del teléfono o micro mide la distancia euclidiana en tiempo real y calcula la desaceleración precisa para que el conductor no frene de golpe.'}
                  {activeTab === 'seguridad' &&
                    'El chofer mantiene ambas manos en el volante y la mirada en el asfalto. No hay pantallas brillantes ni mensajes de texto invasivos durante la marcha.'}
                </p>

                {/* Hands-Free Voice Capsule */}
                <div
                  onClick={handleTestVoice}
                  className="optical-glass-surface rounded-2xl p-5 border-amber-500/30 dark:border-urbo-amber/40 cursor-pointer select-none mb-6 hover:border-urbo-amber transition-all shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-urbo-amber font-bold uppercase tracking-wider">
                      <Volume2 className={cn('w-4 h-4', voiceTesting && 'animate-bounce')} />
                      <span>Aviso por voz manos libres al chofer</span>
                    </div>
                    {/* Wave Visualizer */}
                    <div className="flex items-center gap-1 h-3">
                      <span className={cn('w-1 bg-urbo-amber rounded-full', voiceTesting ? 'audio-bar-1' : 'h-1')} />
                      <span className={cn('w-1 bg-urbo-amber rounded-full', voiceTesting ? 'audio-bar-2' : 'h-2')} />
                      <span className={cn('w-1 bg-urbo-amber rounded-full', voiceTesting ? 'audio-bar-3' : 'h-3')} />
                      <span className={cn('w-1 bg-urbo-amber rounded-full', voiceTesting ? 'audio-bar-4' : 'h-1.5')} />
                    </div>
                  </div>

                  <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
                    &ldquo;Pasajero esperando, mano derecha.&rdquo;
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span>0 distracciones · El chofer no toca el teléfono</span>
                    <span className="text-amber-600 dark:text-urbo-amber font-semibold">Toca para reproducir</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-urbo-amber flex-shrink-0" />
                    <span>El chofer frena con tiempo y seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-urbo-amber flex-shrink-0" />
                    <span>El pasajero nunca se queda varado</span>
                  </div>
                </div>
              </div>

              {/* Right: Interactive Driver Cockpit View */}
              <div className="lg:col-span-5 flex justify-center">
                <OpticalGlass
                  ambientSheen
                  className="w-full max-w-[360px] p-6 rounded-3xl border-white/20 text-left relative overflow-hidden shadow-xl"
                >
                  <div className="text-xs font-mono uppercase text-slate-400 mb-1">
                    COCKPIT DEL CHOFER · EN RUTA
                  </div>
                  <div className="text-lg font-bold text-white mb-4">
                    LÍNEA 30 · INT 32
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[11px] text-slate-400 font-mono">DISTANCIA A LA PARADA</div>
                      <div className="text-2xl font-black font-tech text-urbo-teal2">300 m</div>
                      <div className="text-xs text-slate-300 mt-0.5">Av. Banzer y 2do Anillo</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-urbo-amber/15 border border-urbo-amber/30">
                      <div className="flex items-center justify-between text-xs font-mono text-urbo-amber font-bold">
                        <span>ESTADO DEL AVISO</span>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-urbo-amber opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-urbo-amber" />
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">
                        Alerta sonora emitida por altavoz
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>Modo conducción segura</span>
                      <span className="text-urbo-teal2 font-bold">ACTIVO</span>
                    </div>
                  </div>
                </OpticalGlass>
              </div>

            </div>
          </GlassSurface>
        </div>

        {/* =================================================================
            EDITORIAL SYSTEM SHOWCASE: 4 SUPPORTING PILLARS
            ================================================================= */}
        <div className="solution-pillars-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Pillar 1: GPS en tiempo real */}
          <GlassSurface variant="surface" interactive specular className="solution-pillar-card p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                GPS en tiempo real y mapa en vivo
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Visualización fluida de los micros acercándose en el mapa. Cálculo exacto de minutos y metros restantes para salir de casa justo a tiempo. Actualización constante con optimización extrema de batería y consumo de datos móviles.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Telemetría de baja latencia</span>
              <span className="text-urbo-teal2 font-bold">ACTUALIZACIÓN CONTINUA</span>
            </div>
          </GlassSurface>

          {/* Pillar 2: Rutas inteligentes & Eficiencia */}
          <GlassSurface variant="surface" interactive specular className="solution-pillar-card p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Rutas más inteligentes
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Algoritmos que aprenden los cuellos de botella históricos de Santa Cruz (horas pico en rotondas y anillos), sugiriendo al chofer el ritmo de avance óptimo para evitar quemar diésel en paradas desiertas.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Optimización de recorrido</span>
              <span className="text-urbo-teal2 font-bold">MENOS COMBUSTIBLE</span>
            </div>
          </GlassSurface>

          {/* Pillar 3: Seguridad urbana nocturna */}
          <GlassSurface variant="surface" interactive specular className="solution-pillar-card p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Seguridad urbana y tranquilidad familiar
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Permite compartir el recorrido en vivo con tu familia en cualquier horario, especialmente de noche. Saben en qué interno viajas y a qué hora desciendes en tu parada, reduciendo el riesgo en esquinas oscuras.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Tranquilidad en traslados</span>
              <span className="text-urbo-teal2 font-bold">VIAJE COMPARTIDO</span>
            </div>
          </GlassSurface>

          {/* Pillar 4: Dashboard y Puntos aliados */}
          <GlassSurface variant="surface" interactive specular className="solution-pillar-card p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-6">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Dashboard de línea y sistema de puntos
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Las directivas acceden a un panel en vivo para auditar frecuencias, vueltas completadas y mapas de calor. A la vez, pasajeros y choferes acumulan puntos canjeables en talleres, llanterías y comercios del recorrido.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Gestión institucional</span>
              <span className="text-urbo-teal2 font-bold">ALIANZAS LOCALES</span>
            </div>
          </GlassSurface>

        </div>

      </div>
    </section>
  );
};
