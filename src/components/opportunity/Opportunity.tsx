import React, { useRef, useEffect } from 'react';
import { Quote, Radio, Cpu, ArrowRight } from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { TESTIMONIAL_DON_MAURICIO } from '@/data/urboData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

export const Opportunity: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.fromTo(
        '.opportunity-text',
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

      // Staggered Cards Reveal
      gsap.fromTo(
        '.opportunity-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: motion.duration.normal,
          stagger: 0.08,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: cardsContainerRef.current || sec,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="oportunidad" 
      className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-[#FAF5EC] text-[#0F1D36] transition-colors duration-300"
    >
      {/* Anchor alias */}
      <span id="problema" className="absolute -top-32" />

      {/* Subtle organic warmth fields */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -left-20 w-[500px] h-[500px] rounded-full bg-[#0F1D36]/5 blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =================================================================
            EDITORIAL HEADLINE STATEMENT (PALETA 30% CREMA CON NAVY & ESMERALDA)
            ================================================================= */}
        <div className="opportunity-text max-w-4xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0F1D36]/5 border border-[#0F1D36]/15 text-[#0F1D36] text-xs font-mono font-semibold tracking-wider uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>DIAGNÓSTICO URBANO · SANTA CRUZ DE LA SIERRA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F1D36] tracking-tight leading-[1.12] mb-6">
            <span className="inline-flex items-baseline font-tech font-black tracking-tight text-[#0F1D36]">
              <span className="text-emerald-600 mr-1 select-none font-extrabold">+</span>
              <span>1,6</span>
            </span>
            <span className="ml-2 sm:ml-3 font-tech font-extrabold tracking-tight text-[#0F1D36]">millones de personas.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-700 to-[#0F1D36] font-tech">
              Información en tiempo real de tu micro al instante y en tus manos.
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-[#2B3B55] leading-relaxed font-normal max-w-3xl">
            Santa Cruz de la Sierra es la ciudad con mayor dinamismo demográfico de Bolivia. 
            Su movilidad descansa a diario sobre más de 130 líneas de transporte público, 
            pero la falta de telemetría visible convierte cada viaje en una espera a ciegas. 
            URBO articula esa infraestructura existente para conectar la calle con el teléfono.
          </p>
        </div>

        {/* =================================================================
            ASYMMETRIC COMPACT EDITORIAL COMPOSITION (1 HERO + 2 SECUNDARIAS)
            ================================================================= */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Don Mauricio Quote: Protagonist Navy Card against Cream Background */}
          <div className="lg:col-span-7 opportunity-card">
            <div className="p-7 sm:p-10 h-full flex flex-col justify-between relative overflow-hidden rounded-3xl bg-[#0F1D36] border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(15,29,54,0.35)]">
              {/* Subtle Refraction Glow */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Quote className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-[11px] font-mono tracking-[0.2em] text-emerald-400 uppercase font-bold">
                      PIEZA EDITORIAL · VOZ DE RUTA
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300">
                    TESTIMONIO EN CABINA
                  </span>
                </div>

                <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-snug tracking-tight">
                  &ldquo;Esto es lo que falta para que el transporte mejore.{' '}
                  <span className="text-emerald-400 font-bold block sm:inline mt-1 sm:mt-0">
                    Entre todos podemos lograrlo.
                  </span>&rdquo;
                </blockquote>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#1B2A47] border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-tech font-black text-sm">
                    DM
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
                      {TESTIMONIAL_DON_MAURICIO.author}
                    </div>
                    <div className="text-xs font-mono text-emerald-300 mt-0.5">
                      {TESTIMONIAL_DON_MAURICIO.role} · {TESTIMONIAL_DON_MAURICIO.context}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
                    Línea 30 SCZ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2 Secondary Balanced Cards in Warm Cream / Crisp White */}
          <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
            
            {/* Pillar 1: Telemetría dormida */}
            <div className="opportunity-card flex-1">
              <div className="p-6 sm:p-7 h-full flex flex-col justify-between rounded-3xl bg-white/90 border border-[#0F1D36]/10 shadow-[0_10px_30px_rgba(15,29,54,0.06)] hover:shadow-[0_15px_35px_rgba(15,29,54,0.12)] transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Radio className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F1D36]">
                      Telemetría GPS ya instalada en los micros
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#374A67] leading-relaxed font-normal">
                    La gran mayoría de micros en Santa Cruz ya circulan con geolocalización a bordo. Esa señal técnica existía encerrada en servidores aislados: URBO es la capa de software que la lleva a la mano de quien espera en la parada.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#0F1D36]/10 flex items-center gap-1.5 text-xs font-mono text-emerald-600 font-bold">
                  <span>Infraestructura activa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Pillar 2: Coordinación digital espontánea */}
            <div className="opportunity-card flex-1">
              <div className="p-6 sm:p-7 h-full flex flex-col justify-between rounded-3xl bg-white/90 border border-[#0F1D36]/10 shadow-[0_10px_30px_rgba(15,29,54,0.06)] hover:shadow-[0_15px_35px_rgba(15,29,54,0.12)] transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F1D36]">
                      De la incertidumbre a la coordinación digital
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#374A67] leading-relaxed font-normal">
                    Hoy los vecinos recurren a grupos informales de WhatsApp para avisarse si un micro ya pasó. Ese comportamiento espontáneo demuestra que la demanda de información en tiempo real es masiva, real y urgente.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#0F1D36]/10 flex items-center gap-1.5 text-xs font-mono text-emerald-600 font-bold">
                  <span>Validación natural de mercado</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
