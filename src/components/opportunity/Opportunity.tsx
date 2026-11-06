import React, { useRef, useEffect } from 'react';
import { Quote, Radio, Cpu, MapPin, ArrowRight } from 'lucide-react';
import { GlassSurface, GlassBadge } from '@/components/ui/Glass';
import { TESTIMONIAL_DON_MAURICIO } from '@/data/urboData';
import { gsap } from 'gsap';

export const Opportunity: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.opportunity-text', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.opportunity-cards', {
        scrollTrigger: {
          trigger: '.opportunity-cards',
          start: 'top 85%',
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="oportunidad" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Anchor alias for existing backward compatibility */}
      <span id="problema" className="absolute -top-32" />

      {/* Atmospheric Ambient Light Fields behind the glass */}
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
            EDITORIAL HEADLINE STATEMENT (MANDATORY COPY CHANGES)
            ================================================================= */}
        <div className="opportunity-text max-w-4xl mb-16 sm:mb-20">
          <GlassBadge variant="neutral" className="mb-6">
            DIAGNÓSTICO URBANO · SANTA CRUZ DE LA SIERRA
          </GlassBadge>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6 font-tech">
            1,6 millones de personas.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
              Información en tiempo real de tu micro al instante y en tus manos.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl">
            Santa Cruz de la Sierra es la ciudad con mayor dinamismo demográfico de Bolivia. 
            Su movilidad descansa a diario sobre más de 130 líneas de transporte público, 
            pero la falta de telemetría visible convierte cada viaje en una espera a ciegas. 
            URBO articula esa infraestructura existente para conectar la calle con el teléfono.
          </p>
        </div>

        {/* =================================================================
            ASYMMETRIC EDITORIAL COMPOSITION (QUOTE + ARCHITECTURAL PILLARS)
            ================================================================= */}
        <div className="opportunity-cards grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Don Mauricio Quote: Central Editorial Feature (Left 7 cols) */}
          <GlassSurface
            variant="elevated"
            specular
            className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-urbo-teal/25"
          >
            {/* Ambient Refraction Glow */}
            <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-urbo-teal/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/30 flex items-center justify-center text-urbo-teal2 mb-8">
                <Quote className="w-6 h-6 stroke-[2.5]" />
              </div>

              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-snug mb-8">
                &ldquo;{TESTIMONIAL_DON_MAURICIO.quote.replace('Entre todos podemos lograrlo.', '')}
                <span className="text-urbo-teal2 underline decoration-urbo-teal/40 underline-offset-8">
                  Entre todos podemos lograrlo.
                </span>&rdquo;
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-base font-bold text-white tracking-wide uppercase font-mono">
                  {TESTIMONIAL_DON_MAURICIO.author}
                </div>
                <div className="text-xs font-mono text-urbo-teal2 mt-0.5">
                  {TESTIMONIAL_DON_MAURICIO.role}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {TESTIMONIAL_DON_MAURICIO.context}
                </div>
              </div>

              <GlassBadge variant="teal">
                TESTIMONIO DE CAMPO
              </GlassBadge>
            </div>
          </GlassSurface>

          {/* Architectural Pillars (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* Pillar 1: Telemetría dormida */}
            <GlassSurface
              variant="surface"
              interactive
              specular
              className="p-7 flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-4">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Telemetría GPS ya instalada en los micros
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  La gran mayoría de los micros en Santa Cruz ya circulan con dispositivos de geolocalización a bordo. Esa señal técnica existía encerrada en servidores aislados. URBO es la capa de software que la lleva a la mano de quien espera.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-urbo-teal2">
                <span>Infraestructura desaprovechada</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </GlassSurface>

            {/* Pillar 2: Del papel a la red inteligente */}
            <GlassSurface
              variant="surface"
              interactive
              specular
              className="p-7 flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  De la incertidumbre a la coordinación digital
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Hoy los vecinos recurren a grupos informales de WhatsApp para avisarse si un micro ya pasó. Ese comportamiento espontáneo demuestra que la demanda de información en tiempo real es masiva y urgente.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-urbo-teal2">
                <span>Validación natural de mercado</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </GlassSurface>

          </div>

        </div>

      </div>
    </section>
  );
};
