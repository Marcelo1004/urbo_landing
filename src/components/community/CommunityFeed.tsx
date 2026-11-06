import React, { useState, useRef, useEffect } from 'react';
import { COMMUNITY_MESSAGES } from '@/data/urboData';
import { GlassSurface, GlassBadge } from '@/components/ui/Glass';
import { Radio, MapPin, CheckCheck, Users, Shield, Clock, Bus, Send, MoreVertical, Phone, Video, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export const CommunityFeed: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'driver' | 'passenger'>('all');
  const chatStreamRef = useRef<HTMLDivElement>(null);

  const filteredMessages =
    filter === 'all'
      ? COMMUNITY_MESSAGES
      : COMMUNITY_MESSAGES.filter((m) => m.role === filter);

  // Animate chat bubble transitions when switching filters
  useEffect(() => {
    if (chatStreamRef.current) {
      gsap.fromTo(
        chatStreamRef.current.children,
        { opacity: 0, y: 12, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [filter]);

  return (
    <section id="comunidad" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-urbo-teal/10 blur-[170px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* =================================================================
              LEFT: THE NATURAL VALIDATION CONTEXT
              ================================================================= */}
          <div className="lg:col-span-5">
            <GlassBadge variant="teal" pulse className="mb-6">
              VALIDACIÓN NATURAL DE CALLE
            </GlassBadge>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6 font-tech">
              El piloto ya vive en la calle de Santa Cruz.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 font-normal">
              Durante 5 meses de trabajo directo con la Línea 30, una comunidad de 140 vecinos y choferes se coordinó a diario de forma espontánea. Los conductores transmitían su ubicación en cada salida y los pasajeros sabían cuándo salir a la esquina.
            </p>

            {/* Verified Stakeholders */}
            <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-urbo-teal2 mt-2 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">Choferes activos en ruta:</strong> Don Neyer (Int 32), Don José Luis (Int 58) y Don Walter (Int 72) con telemetría continua.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-urbo-teal2 mt-2 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">Líder Vaca (Vicepresidente Línea 30):</strong> Respaldando la validación del sistema en la flota norte.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-urbo-amber mt-2 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">1.239 mensajes analizados:</strong> Más del 63% correspondieron exactamente a preguntas de horarios y micros en ruta.
                </p>
              </div>
            </div>

            {/* Organic Growth Callout */}
            <div className="mt-8">
              <GlassSurface variant="subtle" className="p-4 rounded-2xl flex items-center justify-between border-white/10">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-urbo-teal2" />
                  <div>
                    <div className="text-base font-extrabold text-white font-mono">140 Usuarios</div>
                    <div className="text-[11px] text-slate-400 font-mono">Zona Norte · Santa Cruz</div>
                  </div>
                </div>
                <GlassBadge variant="neutral">
                  0 BS EN PUBLICIDAD
                </GlassBadge>
              </GlassSurface>
            </div>

          </div>

          {/* =================================================================
              RIGHT: WHATSAPP DARK + LIQUID GLASS GROUP CHAT
              ================================================================= */}
          <div className="lg:col-span-7">
            <div className="rounded-[32px] overflow-hidden border border-white/20 shadow-2xl liquid-glass-elevated">
              
              {/* WhatsApp Group Window Header */}
              <div className="bg-[#0b1626]/90 px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
                
                {/* Avatar and Group Title */}
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full bg-slate-900 border border-urbo-teal/40 p-1 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <img src="/urbo-logo.png" alt="Grupo Línea 30" className="w-full h-full object-contain" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white font-sans">
                        Piloto Línea 30 · URBO SCZ
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                        VERIFICADO
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      Neyer, José Luis, Walter, Ruthy, Antonio y 135 más...
                    </div>
                  </div>
                </div>

                {/* Filter Pills in Chat Header */}
                <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-mono transition-all',
                      filter === 'all'
                        ? 'bg-urbo-teal text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('driver')}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-mono transition-all',
                      filter === 'driver'
                        ? 'bg-urbo-teal text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Choferes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('passenger')}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-mono transition-all',
                      filter === 'passenger'
                        ? 'bg-urbo-teal text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Pasajeros
                  </button>
                </div>

              </div>

              {/* Mobile Filter Tabs */}
              <div className="sm:hidden flex items-center justify-around bg-slate-950/60 p-2 border-b border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={cn(
                    'px-3 py-1 rounded-full',
                    filter === 'all' ? 'bg-urbo-teal text-slate-950 font-bold' : 'text-slate-400'
                  )}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('driver')}
                  className={cn(
                    'px-3 py-1 rounded-full',
                    filter === 'driver' ? 'bg-urbo-teal text-slate-950 font-bold' : 'text-slate-400'
                  )}
                >
                  Choferes
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('passenger')}
                  className={cn(
                    'px-3 py-1 rounded-full',
                    filter === 'passenger' ? 'bg-urbo-teal text-slate-950 font-bold' : 'text-slate-400'
                  )}
                >
                  Pasajeros
                </button>
              </div>

              {/* Chat Stream with WhatsApp Dark + Liquid Glass Styling */}
              <div
                ref={chatStreamRef}
                className="whatsapp-chat-bg p-4 sm:p-6 space-y-4 max-h-[480px] overflow-y-auto"
              >
                {/* Date stamp capsule */}
                <div className="flex justify-center my-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[10px] font-mono text-slate-400">
                    HISTORIAL REAL DE MENSAJES · SANTA CRUZ
                  </span>
                </div>

                {filteredMessages.map((msg) => {
                  const isDriver = msg.role === 'driver';

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex flex-col',
                        isDriver ? 'items-start' : 'items-end'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[88%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 shadow-lg transition-all',
                          isDriver
                            ? 'bg-[#0f2430]/90 border border-emerald-500/30 text-white rounded-tl-sm'
                            : 'bg-[#18233a]/90 border border-white/15 text-white rounded-tr-sm'
                        )}
                      >
                        {/* Sender Name & Role Tag */}
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              'text-xs font-bold tracking-wide',
                              isDriver ? 'text-emerald-400' : 'text-urbo-teal2'
                            )}>
                              {msg.sender}
                            </span>
                            {msg.intern && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                                {msg.intern}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-mono text-slate-400">
                            {msg.time}
                          </span>
                        </div>

                        {/* Text Message */}
                        {msg.text && (
                          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed mb-2 font-normal">
                            {msg.text}
                          </p>
                        )}

                        {/* WhatsApp Location Card */}
                        {msg.location && (
                          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 mt-1.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                                  msg.location.isLive
                                    ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                                    : 'bg-white/10 text-slate-300'
                                )}
                              >
                                {msg.location.isLive ? (
                                  <Radio className="w-5 h-5 animate-pulse" />
                                ) : (
                                  <MapPin className="w-5 h-5 text-rose-400" />
                                )}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-white">
                                  {msg.location.title}
                                </div>
                                <div className="text-[11px] text-slate-300">
                                  {msg.location.subtitle}
                                </div>
                              </div>
                            </div>

                            {msg.location.isLive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold tracking-wider">
                                EN VIVO
                              </span>
                            )}
                          </div>
                        )}

                        {/* Delivery Read Receipt (Blue Double Check) */}
                        <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-slate-400">
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar (Mockup for authentic WhatsApp look) */}
              <div className="bg-[#0b1626] p-3 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <div className="flex-1 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs">
                  Canal activo de validación piloto · Santa Cruz de la Sierra
                </div>
                <div className="w-9 h-9 rounded-full bg-urbo-teal text-slate-950 flex items-center justify-center flex-shrink-0 font-bold">
                  <Send className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
