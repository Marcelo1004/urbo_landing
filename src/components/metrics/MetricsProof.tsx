import React from 'react';
import { GlassSurface, GlassBadge } from '@/components/ui/Glass';
import { URBO_METRICS } from '@/data/urboData';
import { ShieldCheck, Users, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';

export const MetricsProof: React.FC = () => {
  return (
    <section id="piloto" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Subtle atmospheric ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-urbo-teal/10 blur-[180px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Context Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-4">
          <div>
            <GlassBadge variant="teal" className="mb-4">
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

        {/* Telemetry Glass Ribbon (Apple-style precision readout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {URBO_METRICS.map((metric, idx) => (
            <GlassSurface
              key={idx}
              variant={metric.isAmber ? 'amber' : 'surface'}
              interactive
              specular
              className="p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
                  METRICA 0{idx + 1}
                </span>
                <span className="relative flex h-2 w-2">
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      metric.isAmber ? 'bg-urbo-amber' : 'bg-urbo-teal2'
                    }`}
                  />
                </span>
              </div>

              <div>
                <div
                  className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono mb-2 ${
                    metric.isAmber ? 'text-urbo-amber' : 'text-white'
                  }`}
                >
                  {metric.value}
                </div>
                <div className="text-base font-bold text-slate-100 mb-1.5 font-sans">
                  {metric.label}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
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
