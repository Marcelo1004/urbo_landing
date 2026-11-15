import React, { useState, useRef, useEffect } from 'react';
import { 
  BellRing, 
  Radio, 
  Zap, 
  ShieldCheck, 
  LayoutDashboard, 
  Volume2, 
  Check, 
  ArrowRight,
  Wifi,
  Sparkles
} from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
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
    <section 
      ref={sectionRef} 
      id="solucion" 
      className="relative py-20 lg:py-28 overflow-hidden bg-[#070B14] text-white transition-colors duration-300"
    >
      {/* Anchor alias */}
      <span id="como-funciona" className="absolute -top-32" />

      {/* Atmospheric lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full bg-[#00C9A7]/10 blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[#38BDF8]/10 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="solution-header max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1426] border border-white/10 text-[#00E5BE] text-xs font-mono font-bold tracking-wider uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" />
            <span>TECNOLOGÍA DE MOVILIDAD</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-5 font-tech">
            Menos tiempo en la esquina.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5BE] via-[#38BDF8] to-[#00E5BE] font-tech">
              Más control en tu viaje.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal font-sans">
            Una plataforma diseñada para la realidad urbana de Santa Cruz: simple para el pasajero, segura y con manos libres para el chofer, y transparente para las líneas.
          </p>
        </div>

        {/* =================================================================
            HERO INNOVATION SHOWCASE: MODO "ESPERAR AQUÍ" (PROTAGONIST CARD)
            Deep Navy #0B1426 Luxury Cockpit
            ================================================================= */}
        <div className="solution-hero-glass mb-14">
          <div className="p-6 sm:p-10 rounded-3xl bg-[#0B1426] border border-[#00C9A7]/30 shadow-2xl relative overflow-hidden text-white">
            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-2 mb-8 bg-white/5 p-1 rounded-full border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => handleTabChange('esperar')}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all',
                  activeTab === 'esperar'
                    ? 'bg-[#F4C430] text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
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
                    ? 'bg-[#F4C430] text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
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
                    ? 'bg-[#F4C430] text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                Cero Distracciones
              </button>
            </div>

            <div ref={tabContentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left: Explanation */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase mb-5">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>INNOVACIÓN EXCLUSIVA DE URBO</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  {activeTab === 'esperar' && 'Modo "Esperar Aquí"'}
                  {activeTab === 'rutas' && 'Alerta Acústica a 300 Metros'}
                  {activeTab === 'seguridad' && 'Conducción 100% Segura'}
                </h3>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
                  {activeTab === 'esperar' &&
                    'El pasajero toca un botón en su celular al llegar a la parada. El chofer recibe una alerta de voz nítida y automática exactamente a 300 metros de distancia:'}
                  {activeTab === 'rutas' &&
                    'La antena GPS del teléfono o micro mide la distancia euclidiana en tiempo real y calcula la desaceleración precisa para que el conductor no frene de golpe.'}
                  {activeTab === 'seguridad' &&
                    'El chofer mantiene ambas manos en el volante y la mirada en el asfalto. No hay pantallas brillantes ni mensajes de texto invasivos durante la marcha.'}
                </p>

                {/* Hands-Free Voice Capsule Button */}
                <div
                  onClick={handleTestVoice}
                  className="rounded-2xl p-5 bg-[#1B2A47] border border-amber-400/40 cursor-pointer select-none mb-6 hover:border-amber-400 transition-all shadow-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                      <Volume2 className={cn('w-4 h-4', voiceTesting && 'animate-bounce')} />
                      <span>Aviso por voz manos libres al chofer</span>
                    </div>
                    {/* Wave Visualizer */}
                    <div className="flex items-center gap-1 h-3">
                      <span className={cn('w-1 bg-amber-400 rounded-full', voiceTesting ? 'audio-bar-1' : 'h-1')} />
                      <span className={cn('w-1 bg-amber-400 rounded-full', voiceTesting ? 'audio-bar-2' : 'h-2')} />
                      <span className={cn('w-1 bg-amber-400 rounded-full', voiceTesting ? 'audio-bar-3' : 'h-3')} />
                      <span className={cn('w-1 bg-amber-400 rounded-full', voiceTesting ? 'audio-bar-4' : 'h-1.5')} />
                    </div>
                  </div>

                  <div className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
                    &ldquo;Pasajero esperando, mano derecha.&rdquo;
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs text-slate-400 font-mono">
                    <span>0 distracciones · El chofer no toca el teléfono</span>
                    <span className="text-amber-400 font-semibold">Toca para reproducir</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>El chofer frena con tiempo y seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>El pasajero sube sin correr peligro</span>
                  </div>
                </div>
              </div>

              {/* Right: Driver Cockpit Preview Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[360px] p-6 rounded-3xl bg-[#16253F] border border-white/15 text-left relative overflow-hidden shadow-2xl">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>COCKPIT DEL CHOFER</span>
                    <span className="text-emerald-400 font-bold">EN RUTA</span>
                  </div>
                  <div className="text-lg font-bold text-white mb-4">
                    LÍNEA 30 · INT 32
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[11px] text-slate-400 font-mono">DISTANCIA A LA PARADA</div>
                      <div className="text-2xl font-black font-tech text-emerald-400">300 m</div>
                      <div className="text-xs text-slate-300 mt-0.5">Av. Banzer y 2do Anillo</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-400/15 border border-amber-400/30">
                      <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                        <span>ESTADO DEL AVISO</span>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">
                        Alerta sonora emitida por altavoz
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>Modo conducción segura</span>
                      <span className="text-emerald-400 font-bold">ACTIVO</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* =================================================================
            BREAK REPETITIVE PATTERN: 2 FEATURED CARDS + 2 COMPACT PILLARS
            ================================================================= */}
        <div className="solution-pillars-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Card A: GPS en tiempo real */}
          <div className="solution-pillar-card p-7 sm:p-8 rounded-3xl bg-[#0B1426] border border-white/10 shadow-xl hover:border-[#00C9A7]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#00C9A7]/15 border border-[#00C9A7]/30 flex items-center justify-center text-[#00E5BE] mb-5">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-sans">
                GPS en tiempo real y mapa en vivo
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Visualización fluida de los micros acercándose en el mapa. Cálculo exacto de minutos y metros restantes para salir de casa justo a tiempo. Actualización constante con optimización extrema de batería y consumo de datos móviles.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Telemetría de baja latencia</span>
              <span className="text-[#00E5BE] font-bold">ACTUALIZACIÓN CONTINUA</span>
            </div>
          </div>

          {/* Card B: Dashboard institucional para la línea */}
          <div className="solution-pillar-card p-7 sm:p-8 rounded-3xl bg-[#0B1426] border border-white/10 shadow-xl hover:border-[#38BDF8]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] mb-5">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-sans">
                Dashboard de línea y gestión de flota
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                La directiva visualiza toda su flota en vivo, regularidad de frecuencias, mapa de calor de pasajeros y métricas con evidencia documentada para gestiones con el municipio y control de vueltas completadas.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Gestión institucional</span>
              <span className="text-[#38BDF8] font-bold">CONTROL DE FLOTA</span>
            </div>
          </div>

        </div>

        {/* 2 Compact Feature Strips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="solution-pillar-card p-6 rounded-2xl bg-[#0B1426]/70 border border-white/10 flex items-center gap-4 shadow-sm hover:border-white/20 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#00C9A7]/15 border border-[#00C9A7]/30 flex items-center justify-center text-[#00E5BE] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1 font-sans">
                Seguridad urbana y tranquilidad familiar
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Seguimiento de viaje compartido con familiares en traslados nocturnos para saber en qué interno viajas.
              </p>
            </div>
          </div>

          <div className="solution-pillar-card p-6 rounded-2xl bg-[#0B1426]/70 border border-white/10 flex items-center gap-4 shadow-sm hover:border-white/20 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#F4C430]/15 border border-[#F4C430]/30 flex items-center justify-center text-[#F4C430] flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1 font-sans">
                Rutas más inteligentes y ahorro diésel
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Anticipación de cuellos de botella en anillos y rotondas para reducir combustible quemado en vacío.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
