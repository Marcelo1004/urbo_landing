import React, { useState, useRef, useEffect } from 'react';
import { ROADMAP_STEPS, RoadmapStep } from '@/data/urboData';
import { GlassSurface, GlassBadge } from '@/components/ui/Glass';
import { SciFiLabBackground } from './SciFiLabBackground';
import { Check, Rocket, Sparkles, RotateCcw, AlertTriangle, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Roadmap: React.FC = () => {
  const [isProjected, setIsProjected] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const tubeContainerRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  const meniscusRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Default state: 55% of test tube (Phase 3: Google Play Store active in field)
  const defaultHeight = '55%';
  const projectedHeight = '100%';

  // Reverse copy for visual display only (Phase 5 TOP -> Phase 1 BOTTOM)
  const visualSteps: RoadmapStep[] = [...ROADMAP_STEPS].reverse();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance animation on scroll
      gsap.from('.roadmap-header', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 25,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from(tubeContainerRef.current, {
        scrollTrigger: {
          trigger: tubeContainerRef.current,
          start: 'top 85%',
        },
        scale: 0.92,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1,
        ease: 'back.out(1.2)',
      });

      gsap.from('.roadmap-phase-card', {
        scrollTrigger: {
          trigger: '.roadmap-phases-container',
          start: 'top 85%',
        },
        x: 30,
        opacity: 0,
        filter: 'blur(6px)',
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
      });

      // 2. Projection timeline
      const tl = gsap.timeline({
        paused: true,
        onStart: () => setAnimating(true),
        onComplete: () => setAnimating(false),
        onReverseComplete: () => {
          setAnimating(false);
          setIsProjected(false);
        },
      });

      // Rise liquid column upwards from 55% to 100%
      tl.to(liquidRef.current, {
        height: projectedHeight,
        duration: 2.0,
        ease: 'power2.inOut',
      })
      // Light up Phase 4 (Escalabilidad Santa Cruz) as liquid reaches ~75%
      .to('.roadmap-phase-4', {
        borderColor: 'rgba(166, 255, 0, 0.7)',
        boxShadow: '0 0 30px rgba(166, 255, 0, 0.35)',
        duration: 0.5,
      }, '-=1.0')
      // Light up Phase 5 (Expansión regional) as liquid reaches 100% at the top
      .to('.roadmap-phase-5', {
        borderColor: 'rgba(166, 255, 0, 0.7)',
        boxShadow: '0 0 35px rgba(166, 255, 0, 0.4)',
        duration: 0.5,
      }, '-=0.5')
      // Controlled overflow effect at the top rim
      .to(overflowRef.current, {
        opacity: 1,
        scale: 1.15,
        duration: 0.35,
        ease: 'elastic.out(1.2, 0.4)',
      })
      // Radioactive droplet overflow splash
      .to('.overflow-droplet', {
        opacity: 0.9,
        y: 8,
        stagger: 0.1,
        duration: 0.35,
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
    <section
      ref={sectionRef}
      id="roadmap"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden border-t border-b border-slate-200/50 dark:border-white/5"
    >
      {/* Sci-Fi / Vintage Hybrid Lab Atmospheric Background */}
      <SciFiLabBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Compact & Impactful) */}
        <div className="roadmap-header flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 pb-5 border-b border-slate-200 dark:border-white/10 gap-5">
          <div className="max-w-2xl">
            <GlassBadge variant={isProjected ? 'amber' : 'teal'} className="mb-3">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{isProjected ? 'ESCENARIO PROYECTADO DE EXPANSIÓN' : 'RUTA TÉCNICA VERIFICADA'}</span>
            </GlassBadge>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Progreso y proyección{' '}
              <span className={cn(
                'transition-colors duration-500 font-tech',
                isProjected ? 'text-radioactive-bright' : 'text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400'
              )}>
                en asfalto real.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-normal">
              Cada fase refleja una etapa de adopción urbana medida en la calle, desde la validación en parada hasta el despliegue metropolitano.
            </p>
          </div>

          {/* Interactive Projection Trigger Button */}
          <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleToggleProjection}
              disabled={animating}
              aria-pressed={isProjected}
              className={cn(
                'px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 select-none shadow-lg',
                isProjected
                  ? 'bg-slate-900 border border-radioactive/50 text-radioactive-bright hover:bg-slate-800'
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
            COMPACT HEROIC TWO-COLUMN COMPOSITION: TEST TUBE + PHASES
            ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ===============================================================
              LEFT: ULTRA-REALISTIC RADIOACTIVE GLASS TEST TUBE (420px height)
              =============================================================== */}
          <div ref={tubeContainerRef} className="lg:col-span-4 flex flex-col items-center justify-center">
            
            <div className="relative w-24 sm:w-28 h-[440px] flex flex-col items-center justify-end">
              
              {/* Test Tube Top Rim Lip (Refractive Glass Collar with Bevel) */}
              <div className="absolute top-0 w-32 sm:w-36 h-5 rounded-full bg-white/30 border-2 border-white/50 shadow-lg backdrop-blur-md z-30 flex items-center justify-center">
                <div className="w-20 h-2 rounded-full bg-white/40" />
              </div>

              {/* Overflow Splash Effect (Triggered at top rim upon 100% projection) */}
              <div
                ref={overflowRef}
                className="absolute -top-3 inset-x-0 h-10 flex items-center justify-center z-40 opacity-0 pointer-events-none"
              >
                <div className="w-28 h-6 rounded-full bg-radioactive-bright/90 blur-[2px] shadow-[0_0_35px_#A6FF00]" />
                <span className="overflow-droplet absolute -left-2 top-4 w-2.5 h-3.5 rounded-full bg-radioactive opacity-0" />
                <span className="overflow-droplet absolute right-0 top-3 w-3 h-4 rounded-full bg-radioactive-bright opacity-0" />
              </div>

              {/* Test Tube Glass Cylinder Body with Refraction Layers */}
              <div className="relative w-full h-[420px] rounded-b-[56px] border-x-2 border-b-2 border-white/30 bg-gradient-to-b from-white/10 via-transparent to-white/5 test-tube-glass backdrop-blur-2xl overflow-hidden z-20 flex flex-col justify-end shadow-2xl">
                
                {/* Lateral Specular Highlights (Left & Right tube reflections) */}
                <div className="absolute top-0 left-1.5 bottom-5 w-1.5 bg-gradient-to-b from-white/60 via-white/15 to-white/40 rounded-full pointer-events-none z-30" />
                <div className="absolute top-0 right-1.5 bottom-5 w-1 bg-gradient-to-b from-white/30 via-transparent to-white/15 rounded-full pointer-events-none z-30" />

                {/* Measurement Tick Lines (Volumetric Marks: 0% bottom to 100% top) */}
                <div className="absolute inset-y-0 right-3.5 flex flex-col justify-between py-8 pointer-events-none z-30 font-mono text-[9px] text-slate-400 dark:text-white/60">
                  <span className="flex items-center gap-1 justify-end font-bold text-radioactive-bright">100% <span className="w-2.5 h-0.5 bg-radioactive-bright" /></span>
                  <span className="flex items-center gap-1 justify-end">75% <span className="w-2 h-0.5 bg-slate-300 dark:bg-white/30" /></span>
                  <span className="flex items-center gap-1 justify-end font-bold text-urbo-teal2">50% <span className="w-2.5 h-0.5 bg-urbo-teal2" /></span>
                  <span className="flex items-center gap-1 justify-end">25% <span className="w-2 h-0.5 bg-slate-300 dark:bg-white/30" /></span>
                  <span className="flex items-center gap-1 justify-end">0% <span className="w-2.5 h-0.5 bg-slate-400 dark:bg-white/40" /></span>
                </div>

                {/* The Rising Radioactive Liquid Column with Multi-stop Fluid Glow */}
                <div
                  ref={liquidRef}
                  style={{ height: defaultHeight }}
                  className="relative w-full radioactive-liquid transition-all rounded-b-[52px] flex flex-col justify-start overflow-hidden shadow-[inset_0_0_20px_rgba(166,255,0,0.4)]"
                >
                  {/* Meniscus (Fluid Surface) with animated reflective wave */}
                  <div
                    ref={meniscusRef}
                    className="w-full h-3.5 rounded-[50%] bg-white/90 shadow-[0_0_18px_#FFFFFF] animate-meniscus border-t-2 border-white flex-shrink-0"
                  />

                  {/* Rising Bubbles inside radioactive fluid */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <span className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm bubble-fast" />
                    <span className="absolute bottom-8 right-5 w-2.5 h-2.5 rounded-full bg-white/70 shadow-sm bubble-mid" />
                    <span className="absolute bottom-16 left-6 w-2 h-2 rounded-full bg-white/85 shadow-sm bubble-slow" />
                    <span className="absolute bottom-28 right-8 w-1.5 h-1.5 rounded-full bg-white/75 shadow-sm bubble-fast" />
                  </div>
                </div>

              </div>

              {/* Status Tag below Test Tube */}
              <div className="mt-3 text-center">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">
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
              RIGHT: 5 ROADMAP PHASES (VISUAL ORDER: FASE 5 TOP -> FASE 1 BOTTOM)
              =============================================================== */}
          <div className="lg:col-span-8 flex flex-col gap-2.5 sm:gap-3 roadmap-phases-container">
            
            {/* Projection Alert Banner */}
            {isProjected && (
              <div className="p-3 rounded-2xl bg-radioactive/10 border border-radioactive/30 flex items-center gap-2.5 text-xs text-radioactive-bright font-mono mb-1 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>ESCENARIO PROYECTADO:</strong> Visualización de escalabilidad regional basada en demanda de transporte.
                </span>
              </div>
            )}

            {visualSteps.map((step) => {
              const phaseNum = step.id.replace(/^0+/, '');
              const isDone = step.status === 'done';
              const isActive = step.status === 'active';
              const isUpcoming = step.status === 'upcoming';
              const isProjectedPhase = isProjected && isUpcoming;

              return (
                <div key={step.id} className="roadmap-phase-card">
                  <GlassSurface
                    variant={isProjectedPhase ? 'surface' : isActive ? 'elevated' : 'subtle'}
                    specular={isActive || isProjectedPhase}
                    className={cn(
                      `p-3.5 sm:p-4 rounded-2xl transition-all duration-500 roadmap-phase-${phaseNum}`,
                      isActive && 'border-urbo-teal/40 shadow-[0_0_25px_rgba(0,201,167,0.15)]',
                      isProjectedPhase && 'border-radioactive/50 bg-radioactive/10'
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        {/* Step Status Badge Indicator */}
                        <div
                          className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0',
                            isDone
                              ? 'bg-urbo-teal text-slate-950 font-bold'
                              : isActive
                              ? 'bg-urbo-teal/20 border border-urbo-teal2 text-urbo-teal2'
                              : isProjectedPhase
                              ? 'bg-radioactive/20 border border-radioactive text-radioactive-bright font-bold'
                              : 'bg-black/10 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400'
                          )}
                        >
                          {isDone ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : isActive ? (
                            <Rocket className="w-3.5 h-3.5 text-urbo-teal2" />
                          ) : (
                            <span>{step.id}</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            {step.quarter || `Fase ${phaseNum}`}
                          </span>
                          <h3
                            className={cn(
                              'text-sm sm:text-base font-bold tracking-tight',
                              isProjectedPhase
                                ? 'text-radioactive-bright'
                                : isActive
                                ? 'text-urbo-teal2'
                                : isDone
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-300'
                            )}
                          >
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      {/* Status Pill Tag */}
                      <div>
                        {isDone && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-urbo-teal/15 text-urbo-teal2 border border-urbo-teal/30">
                            COMPLETADA
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-urbo-teal text-slate-950 shadow-sm animate-pulse">
                            EN CURSO · TEST EN CALLE
                          </span>
                        )}
                        {isUpcoming && (
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border transition-colors',
                              isProjectedPhase
                                ? 'bg-radioactive/20 text-radioactive-bright border-radioactive/40'
                                : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'
                            )}
                          >
                            {isProjectedPhase ? 'PROYECCIÓN ACTIVA' : 'SIGUIENTE ETAPA'}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 pl-9 font-normal leading-relaxed">
                      {step.description}
                    </p>
                  </GlassSurface>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
};
