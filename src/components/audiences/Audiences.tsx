import React, { useRef, useEffect } from 'react';
import { Smartphone, Navigation, BarChart3, CheckCircle2, Volume2 } from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

export const Audiences: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.audiences-header',
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

      const cards = sec.querySelectorAll('.audience-card');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: motion.duration.normal,
            ease: motion.ease.enter,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="audiencias" 
      className="relative py-20 lg:py-28 overflow-hidden bg-[#070B14] text-white transition-colors duration-300"
    >
      {/* Anchor alias */}
      <span id="para-quien" className="absolute -top-32" />

      {/* Atmospheric lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-[#00C9A7]/10 blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -left-32 w-[550px] h-[550px] rounded-full bg-[#38BDF8]/10 blur-[170px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="audiences-header max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1426] border border-white/10 text-[#00E5BE] text-xs font-mono font-bold tracking-wider uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" />
            <span>ECOSISTEMA DE MOVILIDAD</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-5 font-tech">
            Una plataforma.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5BE] via-[#38BDF8] to-[#00E5BE] font-tech">
              Tres experiencias a medida.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal font-sans">
            No adaptamos una solución genérica. Diseñamos interfaces y dinámicas específicas para quien viaja, quien conduce y quien administra la línea.
          </p>
        </div>

        {/* =================================================================
            EXPERIENCIAS DIFERENCIADAS (PASAJERO, CHOFER, DIRECTIVA)
            ================================================================= */}
        <div ref={containerRef} className="space-y-8 lg:space-y-10">
          
          {/* 1. PASAJERO: Protagonist Deep Navy Card */}
          <div className="audience-card p-7 sm:p-10 rounded-3xl bg-[#0B1426] border border-[#00C9A7]/30 shadow-2xl text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#00C9A7]/15 border border-[#00C9A7]/30 flex items-center justify-center text-[#00E5BE]">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                      Pasajeros
                    </h3>
                    <div className="text-xs font-mono text-[#00E5BE] tracking-wider uppercase font-semibold">
                      1,6M DE PERSONAS EN SANTA CRUZ
                    </div>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
                  Saber exactamente cuándo salir de casa transforma el día. Elimina la ansiedad de esperar en paradas solitarias y ahorra entre 20 y 30 minutos por viaje.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm text-slate-200">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5BE] flex-shrink-0 mt-0.5" />
                    <span>Mapa en vivo con micros acercándose</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5BE] flex-shrink-0 mt-0.5" />
                    <span>Modo Esperar Aquí con 1 solo toque</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5BE] flex-shrink-0 mt-0.5" />
                    <span>Compartir recorrido nocturno con familiares</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5BE] flex-shrink-0 mt-0.5" />
                    <span>Puntos canjeables en negocios de la ruta</span>
                  </div>
                </div>
              </div>

              {/* Passenger Interactive Phone Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] rounded-3xl p-5 bg-[#0F1C35] border border-white/15 shadow-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-white/10 font-mono">
                    <span>TU PARADA HABITUAL</span>
                    <span className="text-[#00E5BE] font-bold">LÍNEA 30</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-slate-400 font-mono">Micro más cercano</div>
                    <div className="text-3xl font-black font-tech text-white mt-1">3 min</div>
                    <div className="text-xs text-[#00E5BE] font-mono mt-0.5 font-semibold">Interno 32 · 350 metros</div>
                  </div>

                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-[#00E5BE] h-full w-4/5 rounded-full" />
                  </div>

                  <div className="p-3 rounded-xl bg-[#00C9A7]/15 border border-[#00C9A7]/30 text-xs text-center text-[#00E5BE] font-semibold font-mono">
                    ✓ Esperar Aquí confirmado
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2 & 3: CHOFER & DIRECTIVA (Two Editorial Balanced Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* 2. CHOFER (Hands-Free Safety & Route Efficiency) */}
            <div className="audience-card p-7 sm:p-8 rounded-3xl bg-[#0B1426] border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4C430]/15 border border-[#F4C430]/30 flex items-center justify-center text-[#F4C430]">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-sans">
                      Choferes
                    </h3>
                    <div className="text-xs font-mono text-[#F4C430] tracking-wider uppercase font-bold">
                      AVISO POR VOZ · CERO DISTRACCIONES
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5 font-normal">
                  Diseñado para conductores profesionales. No requiere tocar la pantalla ni leer textos mientras manejan por el tráfico de Santa Cruz.
                </p>

                {/* Voice Callout Banner */}
                <div className="p-4 rounded-2xl bg-[#F4C430]/10 border border-[#F4C430]/25 mb-5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#F4C430] font-bold mb-1">
                    <Volume2 className="w-4 h-4" />
                    <span>AVISO POR VOZ A 300 METROS</span>
                  </div>
                  <div className="text-base font-bold text-white font-sans">
                    &ldquo;Pasajero esperando, mano derecha.&rdquo;
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F4C430] flex-shrink-0" />
                    <span>Anticipación de frenada sin maniobras bruscas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F4C430] flex-shrink-0" />
                    <span>Menos combustible quemado en paradas vacías</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F4C430] flex-shrink-0" />
                    <span>Puntos canjeables en talleres mecánicos aliados</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 text-xs font-mono text-[#F4C430] font-semibold">
                PROBADO Y APROBADO POR CHOFERES DE LA LÍNEA 30
              </div>
            </div>

            {/* 3. LÍNEAS Y DIRECTIVAS (Fleet Command Console) */}
            <div className="audience-card p-7 sm:p-8 rounded-3xl bg-[#0B1426] border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#00C9A7]/15 border border-[#00C9A7]/30 flex items-center justify-center text-[#00E5BE]">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-sans">
                      Líneas y Directivas
                    </h3>
                    <div className="text-xs font-mono text-[#00E5BE] tracking-wider uppercase font-bold">
                      CONTROL Y EVIDENCIA TÉCNICA
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5 font-normal">
                  Control total de la flota sin necesidad de comprar equipos costosos. Monitoreo de puntualidad, cumplimiento de frecuencias y datos para defender recorridos.
                </p>

                {/* Simulated Metrics Console */}
                <div className="p-4 rounded-2xl bg-[#070B14] border border-white/10 mb-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>FLOTA MONITOREADA EN VIVO</span>
                    <span className="text-[#00E5BE] font-bold">100% ACTIVA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white">
                    <span>Regularidad de frecuencias</span>
                    <span className="font-bold">94,2%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white">
                    <span>Reportes para Alcaldía / Tránsito</span>
                    <span className="text-[#00E5BE] font-bold">AUTOMÁTICOS</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5BE] flex-shrink-0" />
                    <span>Mapa de calor de demanda real de pasajeros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5BE] flex-shrink-0" />
                    <span>Auditoría de vueltas y horarios por chofer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5BE] flex-shrink-0" />
                    <span>Resolución objetiva de reclamos con historial GPS</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 text-xs font-mono text-[#00E5BE] font-semibold">
                DISPONIBLE PARA ASOCIACIONES Y SINDICATOS DE SCZ
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
