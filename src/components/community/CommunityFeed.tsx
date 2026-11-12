import React, { useState, useRef, useEffect } from 'react';
import { COMMUNITY_MESSAGES } from '@/data/urboData';
import { GlassSurface, GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { Radio, MapPin, CheckCheck, Users, Shield, Clock, Bus, Send, Activity, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CommunityFeed: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'driver' | 'passenger'>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const chatStreamRef = useRef<HTMLDivElement>(null);

  const filteredMessages =
    filter === 'all'
      ? COMMUNITY_MESSAGES
      : COMMUNITY_MESSAGES.filter((m) => m.role === filter);

  // Cinematic scroll reveal
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      gsap.from('.community-left-col', {
        scrollTrigger: {
          trigger: sec,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
        y: 35,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.85,
        ease: 'power3.out',
      });

      gsap.from('.community-chat-window', {
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 45,
        scale: 0.96,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.95,
        ease: 'back.out(1.2)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate chat bubble transitions when switching filters
  useEffect(() => {
    if (chatStreamRef.current) {
      gsap.fromTo(
        chatStreamRef.current.children,
        { opacity: 0, y: 14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [filter]);

  return (
    <section ref={sectionRef} id="comunidad" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Anchor alias */}
      <span id="piloto" className="absolute -top-28" />

      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-urbo-teal/10 blur-[170px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* =================================================================
              LEFT: THE NATURAL VALIDATION CONTEXT
              ================================================================= */}
          <div className="lg:col-span-5 community-left-col">
            <GlassBadge variant="teal" pulse className="mb-5">
              VALIDACIÓN NATURAL DE CALLE
            </GlassBadge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-5 font-tech">
              El piloto ya vive en la calle de Santa Cruz.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
              Durante 5 meses de trabajo directo con la Línea 30, una comunidad de 140 vecinos y choferes se coordinó a diario de forma espontánea. Los conductores transmitían su ubicación en cada salida y los pasajeros sabían cuándo salir a la esquina.
            </p>

            {/* Verified Stakeholders */}
            <div className="space-y-3.5 pt-4 border-t border-white/10 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">Choferes activos en ruta:</strong> Don Neyer (Int 32), Don José Luis (Int 58) y Don Walter (Int 72) con telemetría continua.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-urbo-teal2 mt-1.5 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">Líder Vaca (Vicepresidente Línea 30):</strong> Respaldando la validación del sistema en la flota norte.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-urbo-amber mt-1.5 flex-shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">1.239 mensajes analizados:</strong> Más del 63% correspondieron exactamente a preguntas de horarios y micros en ruta.
                </p>
              </div>
            </div>

            {/* Organic Growth Callout */}
            <div className="mt-7">
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
            <div className="community-chat-window rounded-[28px] overflow-hidden border border-white/20 shadow-2xl liquid-glass-elevated">
              
              {/* WhatsApp Group Window Header */}
              <div className="bg-slate-100/90 dark:bg-[#0b1626]/90 px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between backdrop-blur-md">
                
                {/* Avatar and Group Title */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <UrboLogo size={42} className="!rounded-full shadow-sm" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-sans">
                        Piloto Línea 30 · URBO SCZ
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        VERIFICADO
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Neyer, José Luis, Walter, Ruthy, Antonio y 135 más...
                    </div>
                  </div>
                </div>

                {/* Filter Pills in Chat Header */}
                <div className="hidden sm:flex items-center bg-slate-200/60 dark:bg-white/5 border border-slate-300/60 dark:border-white/10 rounded-full p-0.5">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-mono transition-all',
                      filter === 'all'
                        ? 'bg-urbo-teal text-slate-950 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                        ? 'bg-urbo-teal text-slate-950 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                        ? 'bg-urbo-teal text-slate-950 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    Pasajeros
                  </button>
                </div>

              </div>

              {/* Mobile Filter Tabs */}
              <div className="sm:hidden flex items-center justify-around bg-slate-100 dark:bg-slate-950/60 p-2 border-b border-slate-200 dark:border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={cn(
                    'px-3 py-1 rounded-full transition-all',
                    filter === 'all' ? 'bg-urbo-teal text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('driver')}
                  className={cn(
                    'px-3 py-1 rounded-full transition-all',
                    filter === 'driver' ? 'bg-urbo-teal text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  Choferes
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('passenger')}
                  className={cn(
                    'px-3 py-1 rounded-full transition-all',
                    filter === 'passenger' ? 'bg-urbo-teal text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  Pasajeros
                </button>
              </div>

              {/* Real-time Activity Ticker (Requested: Live Driver Telemetry Status) */}
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span><strong>Don Neyer (Int 32):</strong> transmitiendo telemetría en vivo · Av. Cristo Redentor</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 opacity-80 text-[10px]">
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span>GPS 1 Hz</span>
                </div>
              </div>

              {/* Chat Stream with WhatsApp Dark/Light + Liquid Glass Styling */}
              <div
                ref={chatStreamRef}
                className="bg-slate-50/70 dark:bg-[#070e1b]/80 p-4 sm:p-5 space-y-3.5 max-h-[460px] overflow-y-auto"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(0, 201, 167, 0.4) transparent',
                }}
              >
                {/* Date stamp capsule */}
                <div className="flex justify-center my-1">
                  <span className="px-3 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-950/80 border border-slate-300/60 dark:border-white/10 text-[10px] font-mono text-slate-600 dark:text-slate-400 shadow-sm">
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
                          'max-w-[88%] sm:max-w-[78%] rounded-2xl p-3 sm:p-3.5 shadow-md transition-all',
                          isDriver
                            ? 'bg-emerald-50/90 dark:bg-[#0f2430]/95 border border-emerald-300 dark:border-emerald-500/30 text-slate-900 dark:text-white rounded-tl-sm'
                            : 'bg-white/95 dark:bg-[#18233a]/95 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-tr-sm'
                        )}
                      >
                        {/* Sender Name & Role Tag */}
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              'text-xs font-bold tracking-wide',
                              isDriver ? 'text-emerald-700 dark:text-emerald-400' : 'text-urbo-teal dark:text-urbo-teal2'
                            )}>
                              {msg.sender}
                            </span>
                            {msg.intern && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold">
                                {msg.intern}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {msg.time}
                          </span>
                        </div>

                        {/* Text Message */}
                        {msg.text && (
                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed mb-1.5 font-normal">
                            {msg.text}
                          </p>
                        )}

                        {/* WhatsApp Location Card */}
                        {msg.location && (
                          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 mt-1.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                                  msg.location.isLive
                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                                )}
                              >
                                {msg.location.isLive ? (
                                  <Radio className="w-4 h-4 animate-pulse" />
                                ) : (
                                  <MapPin className="w-4 h-4 text-rose-500" />
                                )}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                  {msg.location.title}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-300">
                                  {msg.location.subtitle}
                                </div>
                              </div>
                            </div>

                            {msg.location.isLive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold tracking-wider">
                                EN VIVO
                              </span>
                            )}
                          </div>
                        )}

                        {/* Delivery Read Receipt (Blue Double Check) */}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar (Mockup for authentic WhatsApp look) */}
              <div className="bg-slate-100 dark:bg-[#0b1626] p-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div className="flex-1 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs shadow-inner">
                  Canal activo de validación piloto · Santa Cruz de la Sierra
                </div>
                <div className="w-9 h-9 rounded-full bg-urbo-teal text-slate-950 flex items-center justify-center flex-shrink-0 font-bold shadow-md hover:scale-105 transition-transform">
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
