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
      className="relative py-20 lg:py-28 overflow-hidden bg-[#FAF5EC] text-[#0F1D36] transition-colors duration-300"
    >
      {/* Anchor alias */}
      <span id="para-quien" className="absolute -top-32" />

      {/* Atmospheric lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[170px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -left-32 w-[550px] h-[550px] rounded-full bg-[#0F1D36]/5 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="audiences-header max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0F1D36]/5 border border-[#0F1D36]/15 text-[#0F1D36] text-xs font-mono font-semibold tracking-wider uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ECOSISTEMA DE MOVILIDAD</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F1D36] tracking-tight leading-[1.08] mb-5 font-tech">
            Una plataforma.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-700 to-[#0F1D36] font-tech">
              Tres experiencias a medida.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-[#2B3B55] leading-relaxed font-normal">
            No adaptamos una solución genérica. Diseñamos interfaces y dinámicas específicas para quien viaja, quien conduce y quien administra la línea.
          </p>
        </div>

        {/* =================================================================
            EXPERIENCIAS DIFERENCIADAS (PASAJERO, CHOFER, DIRECTIVA)
            ================================================================= */}
        <div ref={containerRef} className="space-y-8 lg:space-y-10">
          
          {/* 1. PASAJERO: Protagonist Deep Navy Card */}
          <div className="audience-card p-7 sm:p-10 rounded-3xl bg-[#0F1D36] border border-white/12 shadow-2xl text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Pasajeros
                    </h3>
                    <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                      1,6M DE PERSONAS EN SANTA CRUZ
                    </div>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
                  Saber exactamente cuándo salir de casa transforma el día. Elimina la ansiedad de esperar en paradas solitarias y ahorra entre 20 y 30 minutos por viaje.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm text-slate-200">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Mapa en vivo con micros acercándose</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Modo Esperar Aquí con 1 solo toque</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Compartir recorrido nocturno con familiares</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Puntos canjeables en negocios de la ruta</span>
                  </div>
                </div>
              </div>

              {/* Passenger Interactive Phone Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] rounded-3xl p-5 bg-[#172744] border border-white/15 shadow-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-white/10 font-mono">
                    <span>TU PARADA HABITUAL</span>
                    <span className="text-emerald-400 font-bold">LÍNEA 30</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-slate-400 font-mono">Micro más cercano</div>
                    <div className="text-3xl font-black font-tech text-white mt-1">3 min</div>
                    <div className="text-xs text-emerald-400 font-mono mt-0.5 font-semibold">Interno 32 · 350 metros</div>
                  </div>

                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-emerald-400 h-full w-4/5 rounded-full" />
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-center text-emerald-300 font-semibold font-mono">
                    ✓ Esperar Aquí confirmado
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2 & 3: CHOFER & DIRECTIVA (Two Editorial Balanced Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* 2. CHOFER (Hands-Free Safety & Route Efficiency) */}
            <div className="audience-card p-7 sm:p-8 rounded-3xl bg-white border border-[#0F1D36]/10 shadow-[0_10px_35px_rgba(15,29,54,0.06)] hover:shadow-[0_15px_45px_rgba(15,29,54,0.12)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-500">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0F1D36]">
                      Choferes
                    </h3>
                    <div className="text-xs font-mono text-amber-600 tracking-wider uppercase font-bold">
                      AVISO POR VOZ · CERO DISTRACCIONES
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#374A67] leading-relaxed mb-5 font-normal">
                  Diseñado para conductores profesionales. No requiere tocar la pantalla ni leer textos mientras manejan por el tráfico de Santa Cruz.
                </p>

                {/* Voice Callout Banner */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-5">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-700 font-bold mb-1">
                    <Volume2 className="w-4 h-4" />
                    <span>AVISO POR VOZ A 300 METROS</span>
                  </div>
                  <div className="text-base font-bold text-[#0F1D36] font-sans">
                    &ldquo;Pasajero esperando, mano derecha.&rdquo;
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#374A67]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Anticipación de frenada sin maniobras bruscas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Menos combustible quemado en paradas vacías</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Puntos canjeables en talleres mecánicos aliados</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-[#0F1D36]/10 text-xs font-mono text-amber-700 font-semibold">
                PROBADO Y APROBADO POR CHOFERES DE LA LÍNEA 30
              </div>
            </div>

            {/* 3. LÍNEAS Y DIRECTIVAS (Fleet Command Console) */}
            <div className="audience-card p-7 sm:p-8 rounded-3xl bg-white border border-[#0F1D36]/10 shadow-[0_10px_35px_rgba(15,29,54,0.06)] hover:shadow-[0_15px_45px_rgba(15,29,54,0.12)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0F1D36]">
                      Líneas y Directivas
                    </h3>
                    <div className="text-xs font-mono text-emerald-600 tracking-wider uppercase font-bold">
                      CONTROL Y EVIDENCIA TÉCNICA
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#374A67] leading-relaxed mb-5 font-normal">
                  Control total de la flota sin necesidad de comprar equipos costosos. Monitoreo de puntualidad, cumplimiento de frecuencias y datos para defender recorridos.
                </p>

                {/* Simulated Metrics Console */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>FLOTA MONITOREADA EN VIVO</span>
                    <span className="text-emerald-600 font-bold">100% ACTIVA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#0F1D36]">
                    <span>Regularidad de frecuencias</span>
                    <span className="font-bold">94,2%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#0F1D36]">
                    <span>Reportes para Alcaldía / Tránsito</span>
                    <span className="text-emerald-600 font-bold">AUTOMÁTICOS</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#374A67]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Mapa de calor de demanda real de pasajeros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Auditoría de vueltas y horarios por chofer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Resolución objetiva de reclamos con historial GPS</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-[#0F1D36]/10 text-xs font-mono text-emerald-600 font-semibold">
                DISPONIBLE PARA ASOCIACIONES Y SINDICATOS DE SCZ
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
