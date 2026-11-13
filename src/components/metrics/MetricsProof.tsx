import React, { useRef, useEffect } from 'react';
import { GlassSurface, GlassBadge } from '@/components/ui/Glass';
import { URBO_METRICS } from '@/data/urboData';
import { ShieldCheck, Users, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';
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
      // Header entrance (pure transform & opacity)
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

      // Metric cards staggered entrance
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

      // Numbers count-up accentuation
      const numbers = sec.querySelectorAll('.metric-number');
      numbers.forEach((num) => {
        gsap.fromTo(
          num,
          { scale: 0.85, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'elastic.out(1.2, 0.4)',
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
    <section ref={sectionRef} id="metricas" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Subtle atmospheric ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-urbo-teal/10 blur-[180px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Context Header */}
        <div className="metrics-header flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 pb-5 border-b border-white/10 gap-4">
          <div>
            <GlassBadge variant="teal" className="mb-3.5">
              TRACCIÓN VERIFICADA EN CALLE
            </GlassBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-tech">
              Evidencia real del piloto en Santa Cruz
            </h2>
          </div>
          <div className="text-xs sm:text-sm font-mono text-slate-400">
            Zona Norte · Línea 30 · Validación 100% orgánica en calle
          </div>
        </div>

        {/* Telemetry Glass Ribbon (2x2 on mobile, 4 across on desktop) */}
        <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {URBO_METRICS.map((metric, idx) => (
            <GlassSurface
              key={idx}
              variant={metric.isAmber ? 'amber' : 'surface'}
              interactive
              specular
              className="metric-card p-4 sm:p-6 lg:p-7 flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-white/10 hover:border-urbo-teal2/40 shadow-glass-volumetric transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle Ambient Hover Glow inside card */}
              <div
                aria-hidden="true"
                className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-urbo-teal/15 blur-2xl pointer-events-none group-hover:bg-urbo-teal/25 transition-all"
              />

              <div className="flex items-center justify-between mb-3 sm:mb-5 relative z-10">
                <span className="text-[9px] sm:text-[11px] font-mono tracking-wider uppercase text-slate-400">
                  METRICA 0{idx + 1}
                </span>
                <span className="relative flex h-2 w-2">
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      metric.isAmber ? 'bg-urbo-amber shadow-[0_0_8px_#F59E0B]' : 'bg-urbo-teal2 shadow-[0_0_8px_#00E5BE]'
                    }`}
                  />
                </span>
              </div>

              <div className="relative z-10">
                <div
                  className={`metric-number text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight font-tech mb-1 sm:mb-2 ${
                    metric.isAmber ? 'text-urbo-amber' : 'text-white'
                  }`}
                >
                  {metric.value}
                </div>
                <div className="text-xs sm:text-base font-bold text-white mb-1 font-sans leading-tight">
                  {metric.label}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">
                  {metric.detail}
                </p>
              </div>
            </GlassSurface>
          ))}
        </div>

        {/* Supporting Institutional Proof Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-urbo-teal2" />
            <span>92 encuestas presenciales completadas en parada</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-urbo-teal2" />
            <span>9 choferes con geolocalización continua en calle</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-urbo-amber" />
            <span>Alianza con directiva de la Línea 30</span>
          </div>
        </div>

      </div>
    </section>
  );
};
