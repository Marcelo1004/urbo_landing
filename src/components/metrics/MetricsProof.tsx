import React, { useRef, useEffect } from 'react';
import { GlassBadge } from '@/components/ui/Glass';
import { URBO_METRICS } from '@/data/urboData';
import { CheckCircle2, TrendingUp, ShieldCheck, Users, Activity } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

export const MetricsProof: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.metrics-header',
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
        '.metric-card',
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: motion.duration.normal,
          stagger: 0.08,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      const numbers = sec.querySelectorAll('.metric-number');
      numbers.forEach((num) => {
        gsap.fromTo(
          num,
          { scale: 0.88, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: num,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="metricas" className="relative py-20 lg:py-28 overflow-hidden bg-[#0F1D36]">
      {/* Ambient background lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] rounded-full bg-emerald-500/10 blur-[190px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Context Header */}
        <div className="metrics-header flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 pb-6 border-b border-white/10 gap-4">
          <div>
            <GlassBadge variant="emerald" className="mb-3.5">
              TRACCIÓN VERIFICADA EN CALLE
            </GlassBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-tech">
              Evidencia real del piloto en Santa Cruz
            </h2>
          </div>
          <div className="text-xs sm:text-sm font-mono text-slate-300">
            Zona Norte · Línea 30 · Validación 100% orgánica en calle
          </div>
        </div>

        {/* Telemetry Glass Ribbon (2x2 on mobile, 4 across on desktop) */}
        <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {URBO_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="metric-card p-5 sm:p-7 flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#172744] to-[#0D182B] border border-white/12 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.7)] hover:border-emerald-500/40 hover:shadow-[0_25px_50px_-10px_rgba(16,185,129,0.2)] transition-all duration-300 relative overflow-hidden group select-none"
            >
              {/* Beveled Top Specular Hairline */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />

              {/* Ambient Hover Glow inside card */}
              <div
                aria-hidden="true"
                className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none group-hover:bg-emerald-500/25 transition-all"
              />

              <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-slate-400 font-bold">
                  MÉTRICA 0{idx + 1}
                </span>
                <span className="relative flex h-2 w-2">
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      metric.isAmber ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]' : 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                    }`}
                  />
                </span>
              </div>

              <div className="relative z-10">
                <div
                  className={`metric-number text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-tech mb-2 ${
                    metric.isAmber ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {metric.value}
                </div>
                <div className="text-sm sm:text-base font-bold text-white mb-1.5 font-sans leading-tight">
                  {metric.label}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {metric.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting Institutional Proof Strip */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>92 encuestas presenciales completadas en parada</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>9 choferes con geolocalización continua en calle</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Alianza con directiva de la Línea 30</span>
          </div>
        </div>

      </div>
    </section>
  );
};
