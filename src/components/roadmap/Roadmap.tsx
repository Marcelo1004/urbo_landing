import React, { useState, useRef, useEffect } from 'react';
import { ROADMAP_STEPS } from '@/data/urboData';
import { GlassSurface, GlassBadge, GlassButton } from '@/components/ui/Glass';
import { Check, Rocket, Sparkles, ArrowRight, RotateCcw, AlertTriangle, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export const Roadmap: React.FC = () => {
  const [isProjected, setIsProjected] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  const meniscusRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Initial setup: Default state is 52% (Phase 3: Google Play Store active)
  const defaultHeight = '52%';
  const projectedHeight = '100%';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create projection timeline
      const tl = gsap.timeline({
        paused: true,
        onStart: () => setAnimating(true),
        onComplete: () => setAnimating(false),
        onReverseComplete: () => {
          setAnimating(false);
          setIsProjected(false);
        },
      });

      // 1. Rise liquid to top
      tl.to(liquidRef.current, {
        height: projectedHeight,
        duration: 2.2,
        ease: 'power2.inOut',
      })
      // 2. Light up Phase 4
      .to('.roadmap-phase-4', {
        borderColor: 'rgba(166, 255, 0, 0.6)',
        boxShadow: '0 0 30px rgba(166, 255, 0, 0.25)',
        duration: 0.6,
      }, '-=1.2')
      // 3. Light up Phase 5
      .to('.roadmap-phase-5', {
        borderColor: 'rgba(166, 255, 0, 0.6)',
        boxShadow: '0 0 30px rgba(166, 255, 0, 0.25)',
        duration: 0.6,
      }, '-=0.6')
      // 4. Controlled overflow effect at top rim
      .to(overflowRef.current, {
        opacity: 1,
        scale: 1.15,
        duration: 0.4,
        ease: 'elastic.out(1.2, 0.4)',
      })
      // 5. Droplet overflow waves
      .to('.overflow-droplet', {
        opacity: 0.8,
        y: 8,
        stagger: 0.1,
        duration: 0.4,
      }, '-=0.2');

      timelineRef.current = tl;
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleToggleProjection = () => {
    if (!timelineRef.current || animating) return;

    if (!isProjected) {
      setIsProjected(true);
      timelineRef.current.play();
    } else {
      timelineRef.current.reverse();
    }
  };

  return (
    <section ref={sectionRef} id="roadmap" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background atmospheric ambient green & teal glow */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[180px] pointer-events-none transition-all duration-1000',
          isProjected ? 'bg-radioactive/20' : 'bg-urbo-teal/10'
        )}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
          <div className="max-w-2xl">
            <GlassBadge variant={isProjected ? 'amber' : 'teal'} className="mb-4">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{isProjected ? 'ESCENARIO PROYECTADO DE EXPANSIÓN' : 'RUTA TÉCNICA VERIFICADA'}</span>
            </GlassBadge>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Progreso y proyección{' '}
              <span className={cn(
                'transition-colors duration-500 font-tech',
                isProjected ? 'text-radioactive-bright' : 'text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 to-teal-400'
              )}>
                en asfalto real.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 font-normal">
              Cada fase refleja una etapa de adopción urbana medida en la calle, desde la validación en parada hasta el despliegue metropolitano.
            </p>
          </div>

          {/* Interactive Projection Trigger Button */}
          <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleToggleProjection}
              disabled={animating}
              className={cn(
                'px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-300 select-none shadow-lg',
                isProjected
                  ? 'bg-slate-900 border border-radioactive/40 text-radioactive-bright hover:bg-slate-800'
                  : 'bg-gradient-to-r from-radioactive via-radioactive-bright to-radioactive-deep text-slate-950 shadow-[0_0_25px_rgba(166,255,0,0.45)] hover:scale-105'
              )}
            >
              {isProjected ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Volver al estado actual</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>¿Cuál es nuestra proyección?</span>
                </>
              )}
            </button>

            {isProjected && (
              <span className="text-[10px] font-mono text-radioactive-bright uppercase tracking-wider animate-pulse">
                ⚡ Modo Proyección Activo
              </span>
            )}
          </div>
        </div>

        {/* =================================================================
            TWO-COLUMN COMPOSITION: VERTICAL TEST TUBE + PHASES
            ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* ===============================================================
              LEFT: RADIOACTIVE GLASS TEST TUBE (CYLINDRICAL TUBE)
              =============================================================== */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            
            <div className="relative w-28 sm:w-32 h-[520px] flex flex-col items-center justify-end">
              
              {/* Test Tube Top Rim Lip (Glass Collar) */}
              <div className="absolute top-0 w-36 sm:w-40 h-5 rounded-full bg-white/20 border-2 border-white/40 shadow-md backdrop-blur-md z-30 flex items-center justify-center">
                <div className="w-24 h-2 rounded-full bg-white/30" />
              </div>

              {/* Overflow Splash Effect (Triggered on projection) */}
              <div
                ref={overflowRef}
                className="absolute -top-3 inset-x-0 h-10 flex items-center justify-center z-40 opacity-0 pointer-events-none"
              >
                <div className="w-32 h-6 rounded-full bg-radioactive-bright/80 blur-[2px] shadow-[0_0_25px_#A6FF00]" />
                <span className="overflow-droplet absolute -left-2 top-4 w-2 h-3 rounded-full bg-radioactive opacity-0" />
                <span className="overflow-droplet absolute right-0 top-3 w-2.5 h-3.5 rounded-full bg-radioactive-bright opacity-0" />
              </div>

              {/* Test Tube Glass Cylinder Body */}
              <div className="relative w-full h-[500px] rounded-b-[64px] border-x-2 border-b-2 border-white/25 test-tube-glass backdrop-blur-xl overflow-hidden z-20 flex flex-col justify-end">
                
                {/* Lateral Specular Highlights (Left & Right tube reflections) */}
                <div className="absolute top-0 left-2 bottom-6 w-1.5 bg-gradient-to-b from-white/40 via-white/10 to-white/30 rounded-full pointer-events-none z-30" />
                <div className="absolute top-0 right-2 bottom-6 w-1 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-full pointer-events-none z-30" />

                {/* Measurement Tick Lines (Volumetric Marks) */}
                <div className="absolute inset-y-0 right-4 flex flex-col justify-between py-12 pointer-events-none z-30 font-mono text-[9px] text-white/40">
                  <span className="flex items-center gap-1.5 justify-end">100% <span className="w-2.5 h-0.5 bg-white/30" /></span>
                  <span className="flex items-center gap-1.5 justify-end">75% <span className="w-2 h-0.5 bg-white/25" /></span>
                  <span className="flex items-center gap-1.5 justify-end">50% <span className="w-2.5 h-0.5 bg-white/30" /></span>
                  <span className="flex items-center gap-1.5 justify-end">25% <span className="w-2 h-0.5 bg-white/25" /></span>
                  <span className="flex items-center gap-1.5 justify-end">0% <span className="w-2.5 h-0.5 bg-white/30" /></span>
                </div>

                {/* The Rising Radioactive Liquid Column */}
                <div
                  ref={liquidRef}
                  style={{ height: defaultHeight }}
                  className="relative w-full radioactive-liquid transition-all rounded-b-[60px] flex flex-col justify-start overflow-hidden"
                >
                  {/* Meniscus (Fluid Surface) with animated glow line */}
                  <div
                    ref={meniscusRef}
                    className="w-full h-4 rounded-[50%] bg-white/80 shadow-[0_0_15px_#FFFFFF] animate-meniscus border-t-2 border-white flex-shrink-0"
                  />

                  {/* Rising Bubbles inside radioactive fluid */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <span className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-white/70 shadow-sm bubble-fast" />
                    <span className="absolute bottom-10 right-6 w-3 h-3 rounded-full bg-white/60 shadow-sm bubble-mid" />
                    <span className="absolute bottom-20 left-8 w-2.5 h-2.5 rounded-full bg-white/80 shadow-sm bubble-slow" />
                    <span className="absolute bottom-32 right-10 w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm bubble-fast" />
                  </div>
                </div>

              </div>

              {/* Status Tag below Test Tube */}
              <div className="mt-4 text-center">
                <span className="text-[11px] font-mono text-slate-400 block">
                  Nivel de avance técnico
                </span>
                <span className={cn(
                  'text-xs font-mono font-bold uppercase transition-colors',
                  isProjected ? 'text-radioactive-bright' : 'text-urbo-teal2'
                )}>
                  {isProjected ? 'Proyección Metropol.' : 'Fase 3 Activa'}
                </span>
              </div>

            </div>

          </div>

          {/* ===============================================================
              RIGHT: 5 ROADMAP STATIONS (WITH PROJECTION STYLES)
              =============================================================== */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Projection Alert Banner */}
            {isProjected && (
              <div className="p-3.5 rounded-2xl bg-radioactive/10 border border-radioactive/30 flex items-center gap-3 text-xs text-radioactive-bright font-mono mb-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>ESCENARIO PROYECTADO:</strong> Visualización de escalabilidad regional basada en demanda de transporte.
                </span>
              </div>
            )}

            {ROADMAP_STEPS.map((step, idx) => {
              const isDone = step.status === 'done';
              const isActive = step.status === 'active';
              const isUpcoming = step.status === 'upcoming';
              const isProjectedPhase = isProjected && isUpcoming;

              return (
                <GlassSurface
                  key={step.id}
                  variant={isProjectedPhase ? 'surface' : isActive ? 'elevated' : 'subtle'}
                  specular={isActive || isProjectedPhase}
                  className={cn(
                    `p-5 sm:p-6 rounded-2xl transition-all duration-500 roadmap-phase-${idx + 1}`,
                    isActive && 'border-urbo-teal/40 shadow-[0_0_25px_rgba(0,201,167,0.15)]',
                    isProjectedPhase && 'border-radioactive/40 bg-radioactive/5'
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      {/* Step Status Badge Indicator */}
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0',
                          isDone
                            ? 'bg-urbo-teal text-slate-950 font-bold'
                            : isActive
                            ? 'bg-urbo-teal/20 border border-urbo-teal2 text-urbo-teal2'
                            : isProjectedPhase
                            ? 'bg-radioactive/20 border border-radioactive text-radioactive-bright font-bold'
                            : 'bg-white/5 border border-white/10 text-slate-400'
                        )}
                      >
                        {isDone ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : isActive ? (
                          <Rocket className="w-4 h-4 text-urbo-teal2" />
                        ) : (
                          <span>{step.id}</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          {step.quarter || `Fase ${idx + 1}`}
                        </span>
                        <h3
                          className={cn(
                            'text-base sm:text-lg font-bold tracking-tight',
                            isProjectedPhase
                              ? 'text-radioactive-bright'
                              : isActive
                              ? 'text-urbo-teal2'
                              : isDone
                              ? 'text-white'
                              : 'text-slate-300'
                          )}
                        >
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status Pill Tag */}
                    <div>
                      {isDone && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-urbo-teal/15 text-urbo-teal2 border border-urbo-teal/30">
                          COMPLETADA
                        </span>
                      )}
                      {isActive && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-urbo-teal text-slate-950 shadow-sm animate-pulse">
                          EN CURSO · TEST EN CALLE
                        </span>
                      )}
                      {isUpcoming && (
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors',
                            isProjectedPhase
                              ? 'bg-radioactive/20 text-radioactive-bright border-radioactive/40'
                              : 'bg-white/5 text-slate-400 border-white/10'
                          )}
                        >
                          {isProjectedPhase ? 'PROYECCIÓN ACTIVA' : 'SIGUIENTE ETAPA'}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 pl-11 font-normal leading-relaxed">
                    {step.description}
                  </p>
                </GlassSurface>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
};
