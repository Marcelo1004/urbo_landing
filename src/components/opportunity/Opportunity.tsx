import React, { useRef, useEffect } from 'react';
import { Quote, Radio, Cpu, ArrowRight } from 'lucide-react';
import { GlassSurface, GlassBadge, LiquidGlass } from '@/components/ui/Glass';
import { TESTIMONIAL_DON_MAURICIO } from '@/data/urboData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Opportunity: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.from('.opportunity-text', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.85,
        ease: 'power3.out',
      });

      // Compact Cards Staggered Reveal with Blur & Lift
      gsap.from('.opportunity-card', {
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: 'top 82%',
        },
        y: 40,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
      });

      // Micro tilt on cards
      const cards = document.querySelectorAll('.opportunity-card');
      cards.forEach((card) => {
        const handleCardMouseMove = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (card as HTMLElement).getBoundingClientRect();
          const x = (mouseEvent.clientX - rect.left - rect.width / 2) * 0.05;
          const y = (mouseEvent.clientY - rect.top - rect.height / 2) * 0.05;
          gsap.to(card, { rotationY: x, rotationX: -y, duration: 0.3, ease: 'power1.out' });
        };
        const handleCardMouseLeave = () => {
          gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power2.out' });
        };
        card.addEventListener('mousemove', handleCardMouseMove);
        card.addEventListener('mouseleave', handleCardMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="oportunidad" className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Anchor alias for backward compatibility */}
      <span id="problema" className="absolute -top-32" />

      {/* Atmospheric Ambient Light Fields */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-urbo-teal/10 blur-[170px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full bg-slate-800/40 blur-[150px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =================================================================
            EDITORIAL HEADLINE STATEMENT (MANDATORY COPY: "+1,6 millones")
            ================================================================= */}
        <div className="opportunity-text max-w-4xl mb-12 sm:mb-16">
          <GlassBadge variant="neutral" className="mb-5">
            DIAGNÓSTICO URBANO · SANTA CRUZ DE LA SIERRA
          </GlassBadge>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
            <span className="inline-flex items-baseline font-tech font-black tracking-tight text-white">
              <span className="text-urbo-teal2 mr-1 select-none font-extrabold">+</span>
              <span>1,6</span>
            </span>
            <span className="ml-2 sm:ml-3 font-tech font-extrabold tracking-tight text-white">millones de personas.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
              Información en tiempo real de tu micro al instante y en tus manos.
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal max-w-3xl">
            Santa Cruz de la Sierra es la ciudad con mayor dinamismo demográfico de Bolivia. 
            Su movilidad descansa a diario sobre más de 130 líneas de transporte público, 
            pero la falta de telemetría visible convierte cada viaje en una espera a ciegas. 
            URBO articula esa infraestructura existente para conectar la calle con el teléfono.
          </p>
        </div>

        {/* =================================================================
            ASYMMETRIC COMPACT EDITORIAL COMPOSITION (DON MAURICIO + PILLARS)
            ================================================================= */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* Don Mauricio Quote: Compact High-Density Insight Feature (Left 7 cols) */}
          <div className="lg:col-span-7 opportunity-card">
            <LiquidGlass
              fluorescentBorder
              className="p-5 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden border-urbo-teal/35 rounded-3xl hover:shadow-[0_0_35px_rgba(0,201,167,0.25)] transition-all duration-500"
            >
              {/* Subtle Ambient Refraction Glow */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-urbo-teal/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-urbo-teal/15 border border-urbo-teal/30 flex items-center justify-center text-urbo-teal2">
                    <Quote className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </div>
                  <GlassBadge variant="teal">
                    TESTIMONIO DE CAMPO
                  </GlassBadge>
                </div>

                <blockquote className="text-base sm:text-xl lg:text-2xl font-semibold text-white leading-snug">
                  &ldquo;{TESTIMONIAL_DON_MAURICIO.quote.replace('Entre todos podemos lograrlo.', '')}
                  <span className="text-urbo-teal2 underline decoration-urbo-teal/40 underline-offset-4">
                    Entre todos podemos lograrlo.
                  </span>&rdquo;
                </blockquote>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
                    {TESTIMONIAL_DON_MAURICIO.author}
                  </div>
                  <div className="text-xs font-mono text-urbo-teal2 mt-0.5">
                    {TESTIMONIAL_DON_MAURICIO.role} · {TESTIMONIAL_DON_MAURICIO.context}
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Línea 30 SCZ
                </span>
              </div>
            </LiquidGlass>
          </div>

          {/* Architectural Compact Pillars (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-5 justify-between">
            
            {/* Pillar 1: Telemetría dormida */}
            <div className="opportunity-card flex-1">
              <GlassSurface
                variant="surface"
                interactive
                specular
                className="p-4 sm:p-6 h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl hover:shadow-[0_0_25px_rgba(0,201,167,0.15)] transition-all"
              >
                <div>
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 flex-shrink-0">
                      <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Telemetría GPS ya instalada en los micros
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    La gran mayoría de micros en Santa Cruz ya circulan con geolocalización a bordo. Esa señal técnica existía encerrada en servidores aislados: URBO es la capa de software que la lleva a la mano de quien espera.
                  </p>
                </div>
                <div className="pt-2.5 sm:pt-3 mt-2.5 sm:mt-3 border-t border-white/10 flex items-center gap-1.5 text-xs font-mono text-urbo-teal2 font-semibold">
                  <span>Infraestructura activa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </GlassSurface>
            </div>

            {/* Pillar 2: Coordinación digital espontánea */}
            <div className="opportunity-card flex-1">
              <GlassSurface
                variant="surface"
                interactive
                specular
                className="p-4 sm:p-6 h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl hover:shadow-[0_0_25px_rgba(0,201,167,0.15)] transition-all"
              >
                <div>
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 flex-shrink-0">
                      <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      De la incertidumbre a la coordinación digital
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Hoy los vecinos recurren a grupos informales de WhatsApp para avisarse si un micro ya pasó. Ese comportamiento espontáneo demuestra que la demanda de información en tiempo real es masiva y urgente.
                  </p>
                </div>
                <div className="pt-2.5 sm:pt-3 mt-2.5 sm:mt-3 border-t border-white/10 flex items-center gap-1.5 text-xs font-mono text-urbo-teal2 font-semibold">
                  <span>Validación natural de mercado</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </GlassSurface>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
