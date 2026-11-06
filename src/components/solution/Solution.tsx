import React, { useState } from 'react';
import { 
  BellRing, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  LayoutDashboard, 
  Volume2, 
  Smartphone, 
  Check, 
  ArrowRight,
  Navigation
} from 'lucide-react';
import { GlassSurface, GlassBadge, GlassButton } from '@/components/ui/Glass';
import { cn } from '@/lib/utils';

export const Solution: React.FC = () => {
  const [voiceTesting, setVoiceTesting] = useState(false);

  const handleTestVoice = () => {
    setVoiceTesting(true);
    setTimeout(() => setVoiceTesting(false), 2400);
  };

  return (
    <section id="solucion" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Anchor alias */}
      <span id="como-funciona" className="absolute -top-32" />

      {/* Atmospheric lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-urbo-teal/15 blur-[170px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -left-32 w-[550px] h-[550px] rounded-full bg-urbo-amber/10 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <GlassBadge variant="teal" className="mb-6">
            TECNOLOGÍA DE MOVILIDAD
          </GlassBadge>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6 font-tech">
            Menos tiempo en la esquina.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-urbo-teal2 via-urbo-teal to-teal-400 font-tech">
              Más control en tu viaje.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            Una plataforma diseñada para la realidad urbana de Santa Cruz: simple para el pasajero, segura y con manos libres para el chofer, y transparente para las líneas.
          </p>
        </div>

        {/* =================================================================
            HERO INNOVATION SHOWCASE: MODO "ESPERAR AQUÍ"
            ================================================================= */}
        <GlassSurface
          variant="amber"
          specular
          className="p-8 sm:p-12 mb-16 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Explanation */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-urbo-amber/15 border border-urbo-amber/30 text-urbo-amber text-xs font-mono font-bold tracking-wider uppercase mb-6">
                <BellRing className="w-3.5 h-3.5" />
                <span>INNOVACIÓN EXCLUSIVA DE URBO</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Modo &ldquo;Esperar Aquí&rdquo;
              </h3>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6">
                El pasajero toca un botón en su celular al llegar a la parada. El chofer recibe una alerta de voz nítida y automática exactamente a 300 metros de distancia:
              </p>

              {/* Hands-Free Voice Capsule */}
              <div
                onClick={handleTestVoice}
                className="liquid-glass-surface rounded-2xl p-5 border-urbo-amber/40 cursor-pointer select-none mb-6 hover:border-urbo-amber transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-urbo-amber font-bold uppercase tracking-wider">
                    <Volume2 className={cn('w-4 h-4', voiceTesting && 'animate-bounce')} />
                    <span>Aviso por voz manos libres al chofer</span>
                  </div>
                  {/* Wave Visualizer */}
                  <div className="flex items-center gap-1 h-3">
                    <span className={cn('w-1 bg-urbo-amber rounded-full', voiceTesting ? 'audio-bar-1' : 'h-1')} />
                    <span className={cn('w-1 bg-urbo-amber rounded-full', voiceTesting ? 'audio-bar-2' : 'h-2')} />
                    <span className={cn('w-1 bg-urbo-amber rounded-full', voiceTesting ? 'audio-bar-3' : 'h-3')} />
                    <span className={cn('w-1 bg-urbo-amber rounded-full', voiceTesting ? 'audio-bar-4' : 'h-1.5')} />
                  </div>
                </div>

                <div className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
                  &ldquo;Pasajero esperando, mano derecha.&rdquo;
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs text-slate-400 font-mono">
                  <span>0 distracciones · El chofer no toca el teléfono</span>
                  <span className="text-urbo-amber font-semibold">Toca para reproducir</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-urbo-amber flex-shrink-0" />
                  <span>El chofer frena con tiempo y seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-urbo-amber flex-shrink-0" />
                  <span>El pasajero nunca se queda varado</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Driver Cockpit View */}
            <div className="lg:col-span-5 flex justify-center">
              <GlassSurface
                variant="elevated"
                specular
                className="w-full max-w-[360px] p-6 rounded-3xl border-white/15 text-left relative overflow-hidden"
              >
                <div className="text-xs font-mono uppercase text-slate-400 mb-1">
                  COCKPIT DEL CHOFER · EN RUTA
                </div>
                <div className="text-lg font-bold text-white mb-4">
                  LÍNEA 30 · INT 32
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-slate-400 font-mono">DISTANCIA A LA PARADA</div>
                    <div className="text-2xl font-black font-mono text-urbo-teal2">300 m</div>
                    <div className="text-xs text-slate-300 mt-0.5">Av. Banzer y 2do Anillo</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-urbo-amber/15 border border-urbo-amber/30">
                    <div className="flex items-center justify-between text-xs font-mono text-urbo-amber font-bold">
                      <span>ESTADO DEL AVISO</span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-urbo-amber opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-urbo-amber" />
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">
                      Alerta sonora emitida por altavoz
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>Modo conducción segura</span>
                    <span className="text-urbo-teal2 font-bold">ACTIVO</span>
                  </div>
                </div>
              </GlassSurface>
            </div>

          </div>
        </GlassSurface>

        {/* =================================================================
            EDITORIAL SYSTEM SHOWCASE: 4 SUPPORTING PILLARS
            ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Pillar 1: GPS en tiempo real */}
          <GlassSurface variant="surface" interactive specular className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                GPS en tiempo real y mapa en vivo
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Visualización fluida de los micros acercándose en el mapa. Cálculo exacto de minutos y metros restantes para salir de casa justo a tiempo. Actualización constante con optimización extrema de batería y consumo de datos móviles.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Telemetría de baja latencia</span>
              <span className="text-urbo-teal2 font-bold">ACTUALIZACIÓN CONTINUA</span>
            </div>
          </GlassSurface>

          {/* Pillar 2: Rutas inteligentes & Eficiencia */}
          <GlassSurface variant="surface" interactive specular className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Rutas más inteligentes
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Algoritmos que aprenden los cuellos de botella históricos de Santa Cruz (horas pico en rotondas y anillos), sugiriendo al chofer el ritmo de avance óptimo para evitar quemar diésel en paradas desiertas.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Optimización de recorrido</span>
              <span className="text-urbo-teal2 font-bold">MENOS COMBUSTIBLE</span>
            </div>
          </GlassSurface>

          {/* Pillar 3: Seguridad urbana nocturna */}
          <GlassSurface variant="surface" interactive specular className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Seguridad urbana y tranquilidad familiar
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Permite compartir el recorrido en vivo con tu familia en cualquier horario, especialmente de noche. Saben en qué interno viajas y a qué hora desciendes en tu parada, reduciendo el riesgo en esquinas oscuras.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Tranquilidad en traslados</span>
              <span className="text-urbo-teal2 font-bold">VIAJE COMPARTIDO</span>
            </div>
          </GlassSurface>

          {/* Pillar 4: Dashboard y Puntos aliados */}
          <GlassSurface variant="surface" interactive specular className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-urbo-teal/15 border border-urbo-teal/25 flex items-center justify-center text-urbo-teal2 mb-6">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Dashboard de línea y sistema de puntos
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Las directivas acceden a un panel en vivo para auditar frecuencias, vueltas completadas y mapas de calor. A la vez, pasajeros y choferes acumulan puntos canjeables en talleres, llanterías y comercios del recorrido.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Gestión institucional</span>
              <span className="text-urbo-teal2 font-bold">ALIANZAS LOCALES</span>
            </div>
          </GlassSurface>

        </div>

      </div>
    </section>
  );
};
