import React, { useRef, useEffect } from 'react';
import { Smartphone, Navigation, BarChart3, CheckCircle2, Shield, Award, MapPin, Bus, ArrowUpRight, Volume2 } from 'lucide-react';
import { GlassSurface, GlassBadge, LiquidGlass } from '@/components/ui/Glass';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      // Header reveal (pure transform & opacity)
      gsap.fromTo(
        '.audiences-header',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Storytelling cards depth reveal
      const cards = sec.querySelectorAll('.audience-card');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 30 + i * 10,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
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
    <section ref={sectionRef} id="audiencias" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Anchor alias */}
      <span id="para-quien" className="absolute -top-32" />

      {/* Atmospheric lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-urbo-teal/10 blur-[170px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -left-32 w-[550px] h-[550px] rounded-full bg-slate-800/40 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="audiences-header max-w-3xl mb-14 sm:mb-16">
          <GlassBadge variant="teal" className="mb-5">
            ECOSISTEMA DE MOVILIDAD
          </GlassBadge>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-5 font-tech">
            Una plataforma.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
              Tres experiencias creadas a medida.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            No adaptamos una solución genérica. Diseñamos interfaces y dinámicas específicas para quien viaja, quien conduce y quien administra la línea.
          </p>
        </div>

        {/* =================================================================
            EXPERIENCIAS DIFERENCIADAS (PASAJERO, CHOFER, DIRECTIVA)
            ================================================================= */}
        <div ref={containerRef} className="space-y-10 lg:space-y-12">
          
          {/* 1. PASAJERO: Large Asymmetric Row (App Experience) */}
          <LiquidGlass
            className="audience-card p-6 sm:p-10 border-urbo-teal/30 rounded-3xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/30 flex items-center justify-center text-urbo-teal2">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Pasajeros
                    </h3>
                    <div className="text-xs font-mono text-urbo-teal2 tracking-wider uppercase font-semibold">
                      1,6M DE PERSONAS EN SANTA CRUZ
                    </div>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
                  Saber exactamente cuándo salir de casa transforma el día. Elimina la ansiedad de esperar en paradas solitarias y ahorra entre 20 y 30 minutos por viaje.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 mb-6">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-urbo-teal2 flex-shrink-0 mt-0.5" />
                    <span>Mapa en vivo con micros acercándose</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-urbo-teal2 flex-shrink-0 mt-0.5" />
                    <span>Modo Esperar Aquí con 1 solo toque</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-urbo-teal2 flex-shrink-0 mt-0.5" />
                    <span>Compartir recorrido nocturno con familiares</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-urbo-teal2 flex-shrink-0 mt-0.5" />
                    <span>Puntos canjeables en negocios de la ruta</span>
                  </div>
                </div>
              </div>

              {/* Passenger Interactive Glass Phone Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] rounded-3xl p-5 optical-glass-surface border-white/20 shadow-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-white/10 font-mono">
                    <span>TU PARADA HABITUAL</span>
                    <span className="text-urbo-teal2 font-bold">LÍNEA 30</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-slate-400">Micro más cercano</div>
                    <div className="text-3xl font-black font-tech text-white mt-1">3 min</div>
                    <div className="text-xs text-urbo-teal2 font-mono mt-0.5 font-semibold">Interno 32 · 350 metros</div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-urbo-teal2 h-full w-4/5 rounded-full" />
                  </div>

                  <div className="p-3 rounded-xl bg-urbo-teal/15 border border-urbo-teal/25 text-xs text-center text-urbo-teal2 font-semibold">
                    ✓ Esperar Aquí confirmado
                  </div>
                </div>
              </div>

            </div>
          </LiquidGlass>

          {/* 2 & 3: CHOFER & DIRECTIVA (Two Editorial Balanced Glass Suites) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            
            {/* 2. CHOFER (Hands-Free Safety & Route Efficiency) */}
            <GlassSurface
              variant="amber"
              interactive
              specular
              className="audience-card p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-urbo-amber/15 border border-urbo-amber/30 flex items-center justify-center text-urbo-amber">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Choferes
                    </h3>
                    <div className="text-xs font-mono text-amber-700 dark:text-urbo-amber tracking-wider uppercase font-semibold">
                      AVISO POR VOZ · CERO DISTRACCIONES
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed mb-6 font-normal">
                  Diseñado para conductores profesionales. No requiere tocar la pantalla ni leer textos mientras manejan por el tráfico caótico de Santa Cruz.
                </p>

                {/* Voice Callout Banner */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-black/30 border border-amber-500/30 dark:border-urbo-amber/30 mb-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-urbo-amber font-bold mb-1">
                    <Volume2 className="w-4 h-4" />
                    <span>AVISO POR VOZ A 300 METROS</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-sans">
                    &ldquo;Pasajero esperando, mano derecha.&rdquo;
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-urbo-amber flex-shrink-0" />
                    <span>Anticipación de frenada sin maniobras bruscas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-urbo-amber flex-shrink-0" />
                    <span>Menos combustible quemado en paradas vacías</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-urbo-amber flex-shrink-0" />
                    <span>Puntos canjeables en talleres mecánicos aliados</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-slate-300">
                PROBADO Y APROBADO POR CHOFERES DE LA LÍNEA 30
              </div>
            </GlassSurface>

            {/* 3. LÍNEAS Y DIRECTIVAS (Fleet Command Console) */}
            <GlassSurface
              variant="elevated"
              interactive
              specular
              className="audience-card p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/30 flex items-center justify-center text-urbo-teal2">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Líneas y Directivas
                    </h3>
                    <div className="text-xs font-mono text-urbo-teal2 tracking-wider uppercase font-semibold">
                      CONTROL Y EVIDENCIA TÉCNICA
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                  Control total de la flota sin necesidad de comprar equipos costosos. Monitoreo de puntualidad, cumplimiento de frecuencias y datos para defender recorridos.
                </p>

                {/* Simulated Metrics Console */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span>FLOTA MONITOREADA EN VIVO</span>
                    <span className="text-urbo-teal2 font-bold">100% ACTIVA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
                    <span>Regularidad de frecuencias</span>
                    <span className="text-slate-900 dark:text-white font-bold">94,2%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
                    <span>Reportes para Alcaldía / Tránsito</span>
                    <span className="text-urbo-teal2 font-bold">AUTOMÁTICOS</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-urbo-teal2 flex-shrink-0" />
                    <span>Mapa de calor de demanda real de pasajeros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-urbo-teal2 flex-shrink-0" />
                    <span>Auditoría de vueltas y horarios por chofer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-urbo-teal2 flex-shrink-0" />
                    <span>Resolución objetiva de reclamos con historial GPS</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-slate-400">
                DISPONIBLE PARA ASOCIACIONES Y SINDICATOS DE SCZ
              </div>
            </GlassSurface>

          </div>

        </div>

      </div>
    </section>
  );
};
