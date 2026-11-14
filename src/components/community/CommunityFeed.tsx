import React, { useState, useRef, useEffect } from 'react';
import { GlassSurface, GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { 
  Radio, 
  MapPin, 
  CheckCheck, 
  Users, 
  Send, 
  Wifi, 
  Play, 
  Pause, 
  Mic, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

interface FeedMessage {
  id: string;
  type: 'system' | 'driver' | 'passenger';
  sender?: string;
  roleBadge?: string;
  intern?: string;
  time: string;
  text?: string;
  isAudio?: boolean;
  audioDuration?: string;
  location?: {
    title: string;
    subtitle: string;
    isLive: boolean;
  };
}

const FEED_MESSAGES: FeedMessage[] = [
  {
    id: 'sys-1',
    type: 'system',
    time: '06:25 a.m.',
    text: '🔒 Los mensajes y llamadas de este grupo de validación están protegidos con telemetría en vivo URBO.',
  },
  {
    id: 'sys-2',
    type: 'system',
    time: '06:30 a.m.',
    text: '📡 Don Neyer (Int 32) activó transmisión GPS en Casco Viejo · Frecuencia 1 Hz',
  },
  {
    id: 'msg-1',
    type: 'driver',
    sender: 'Don Neyer',
    intern: 'INT 32',
    roleBadge: 'Chofer Línea 30',
    time: '06:47 a.m.',
    text: 'Buen día vecinos. Saliendo de parada norte rumbo al centro por 2do Anillo.',
    location: {
      title: 'Ubicación en tiempo real compartida',
      subtitle: 'Av. Cañoto esq. Junín · Rumbo a Plaza 24 de Septiembre',
      isLive: true,
    },
  },
  {
    id: 'msg-2',
    type: 'passenger',
    sender: 'Ruthy Mendoza',
    roleBadge: 'Pasajera Frecuente',
    time: '06:50 a.m.',
    text: 'Buenos días Don Neyer 🙏 ¿Viene con espacio? Estamos en la esquina de la farmacia esperándolo.',
  },
  {
    id: 'msg-3',
    type: 'driver',
    sender: 'Don Neyer',
    intern: 'INT 32',
    roleBadge: 'Chofer Línea 30',
    time: '06:51 a.m.',
    isAudio: true,
    audioDuration: '0:14',
    text: 'Nota de voz: "Sí vecina, voy con asientos libres, en 3 minutos paso por ahí."',
  },
  {
    id: 'msg-4',
    type: 'driver',
    sender: 'Don José Luis',
    intern: 'INT 58',
    roleBadge: 'Chofer Línea 30',
    time: '06:55 a.m.',
    text: 'Saliendo del norte hacia el centro por la Suárez de Figueroa.',
    location: {
      title: 'Ubicación en tiempo real compartida',
      subtitle: 'Calle René Moreno y Suárez de Figueroa · Int 58',
      isLive: true,
    },
  },
  {
    id: 'msg-5',
    type: 'passenger',
    sender: 'Mariana Ribera',
    roleBadge: 'Pasajera',
    time: '06:58 a.m.',
    text: '¡Excelente! Ya lo vimos en el mapa con el puntito azul acercándose. Qué alivio no esperar a ciegas 👍',
  },
];

export const CommunityFeed: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'driver' | 'passenger'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const chatStreamRef = useRef<HTMLDivElement>(null);

  const filteredMessages = FEED_MESSAGES.filter((msg) => {
    if (filter === 'all') return true;
    if (filter === 'driver') return msg.type === 'driver' || msg.type === 'system';
    if (filter === 'passenger') return msg.type === 'passenger' || msg.type === 'system';
    return true;
  });

  // Entrance scroll reveal
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.community-left-col',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
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
        '.community-chat-window',
        { y: 28, scale: 0.98, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: motion.duration.normal,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate chat bubble transitions when switching filters
  useEffect(() => {
    if (chatStreamRef.current) {
      gsap.fromTo(
        chatStreamRef.current.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.28, stagger: 0.03, ease: 'power2.out' }
      );
    }
  }, [filter]);

  return (
    <section ref={sectionRef} id="comunidad" className="relative py-20 lg:py-28 overflow-hidden bg-[#0A1220]">
      {/* Anchor alias */}
      <span id="piloto" className="absolute -top-28" />

      {/* Atmospheric ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-10 w-[550px] h-[550px] rounded-full bg-emerald-500/10 blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#1B2A47]/40 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* =================================================================
              LEFT: THE NATURAL VALIDATION CONTEXT
              ================================================================= */}
          <div className="lg:col-span-5 community-left-col">
            <GlassBadge variant="emerald" pulse className="mb-5">
              VALIDACIÓN NATURAL DE CALLE
            </GlassBadge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-5 font-tech">
              El piloto ya vive en la calle de Santa Cruz.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
              Durante 5 meses de trabajo directo con la Línea 30, una comunidad de 140 vecinos y choferes se coordinó a diario de forma espontánea. Los conductores transmitían su ubicación en cada salida y los pasajeros sabían cuándo salir a la esquina.
            </p>

            {/* Verified Stakeholders */}
            <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_#10B981]" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">Choferes activos en ruta:</strong> Don Neyer (Int 32), Don José Luis (Int 58) y Don Walter (Int 72) con telemetría continua.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_#38BDF8]" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">Líder Vaca (Vicepresidente Línea 30):</strong> Respaldando la validación del sistema en la flota troncal norte.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_#F59E0B]" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">1.239 mensajes analizados:</strong> Más del 63% correspondieron exactamente a preguntas de horarios y micros en ruta.
                </p>
              </div>
            </div>

            {/* Organic Growth Callout Card */}
            <div className="mt-8">
              <div className="p-4 rounded-2xl bg-[#0F1D36] border border-white/12 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-white font-mono">140 Usuarios</div>
                    <div className="text-[11px] text-slate-400 font-mono">Zona Norte · Santa Cruz</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300">
                  0 BS EN PUBLICIDAD
                </span>
              </div>
            </div>

          </div>

          {/* =================================================================
              RIGHT: AUTHENTIC WHATSAPP-STYLE COMMUNITY GROUP CHAT
              Zero Overlap, Authentic Layout, Driver vs Passenger Clear Styling
              ================================================================= */}
          <div className="lg:col-span-7">
            <div className="community-chat-window rounded-[30px] overflow-hidden border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-[#0B1424]">
              
              {/* WhatsApp Group Window Header */}
              <div className="bg-[#0F1D36] px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between">
                
                {/* Avatar and Group Title */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <UrboLogo size={42} className="!rounded-full border-2 border-emerald-500/50 shadow-md" />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0F1D36]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white font-sans">
                        Piloto Línea 30 · URBO SCZ
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        VERIFICADO
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      Don Neyer, José Luis, Walter, Ruthy y 136 más...
                    </div>
                  </div>
                </div>

                {/* Filter Pills in Header */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono transition-all',
                      filter === 'all'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('driver')}
                    className={cn(
                      'px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono transition-all',
                      filter === 'driver'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Choferes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('passenger')}
                    className={cn(
                      'px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono transition-all',
                      filter === 'passenger'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Pasajeros
                  </button>
                </div>

              </div>

              {/* Real-time Activity Ticker Banner */}
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span><strong>Don Neyer (Int 32):</strong> Transmitiendo telemetría en vivo · Plaza 24 de Septiembre</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 opacity-80 text-[10px] text-cyan-300">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  <span>GPS 1 Hz</span>
                </div>
              </div>

              {/* Chat Messages Stream with Room to Breathe (Zero Overlap Guaranteed) */}
              <div
                ref={chatStreamRef}
                className="p-4 sm:p-5 space-y-4 max-h-[480px] overflow-y-auto bg-[radial-gradient(ellipse_at_top,_#0F1D36_0%,_#09101E_100%)]"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(16, 185, 129, 0.4) transparent',
                }}
              >
                {/* Date Stamp Capsule */}
                <div className="flex justify-center my-1">
                  <span className="px-3.5 py-1 rounded-full bg-[#0F1D36] border border-white/10 text-[10px] font-mono text-slate-400 shadow-sm uppercase tracking-wider">
                    HOY · REGISTRO REAL EN CASCO VIEJO
                  </span>
                </div>

                {filteredMessages.map((msg) => {
                  // 1. SYSTEM TELEMETRY MESSAGE
                  if (msg.type === 'system') {
                    return (
                      <div key={msg.id} className="flex justify-center my-2">
                        <div className="max-w-[90%] px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/25 text-[11px] font-mono text-emerald-300 text-center flex items-center gap-2 shadow-sm">
                          <Activity className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{msg.text}</span>
                        </div>
                      </div>
                    );
                  }

                  const isDriver = msg.type === 'driver';

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex flex-col w-full',
                        isDriver ? 'items-start' : 'items-end'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[92%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 shadow-lg transition-all relative',
                          isDriver
                            ? 'bg-[#0E2822] border border-emerald-500/40 text-white rounded-tl-sm'
                            : 'bg-[#162744] border border-white/15 text-white rounded-tr-sm'
                        )}
                      >
                        {/* Sender Header */}
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'text-xs font-bold tracking-wide',
                              isDriver ? 'text-emerald-400' : 'text-cyan-300'
                            )}>
                              {msg.sender}
                            </span>
                            {msg.intern && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-extrabold border border-emerald-500/30">
                                {msg.intern}
                              </span>
                            )}
                            {msg.roleBadge && (
                              <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                                • {msg.roleBadge}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-mono text-slate-400">
                            {msg.time}
                          </span>
                        </div>

                        {/* Audio Note Player Preview (Authentic WhatsApp Voice Message) */}
                        {msg.isAudio ? (
                          <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/30 my-1 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                              className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md hover:scale-105 transition-transform"
                            >
                              {isPlayingAudio ? (
                                <Pause className="w-4 h-4 fill-current" />
                              ) : (
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              )}
                            </button>
                            <div className="flex-1">
                              {/* Audio Waveform Bars */}
                              <div className="flex items-center gap-1 h-4">
                                {[40, 75, 55, 90, 60, 45, 80, 100, 65, 50, 85, 40, 70, 95, 55, 35].map((h, i) => (
                                  <span
                                    key={i}
                                    className={cn(
                                      'w-1 rounded-full transition-all duration-300',
                                      isPlayingAudio ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                                    )}
                                    style={{ height: `${h}%` }}
                                  />
                                ))}
                              </div>
                              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-1">
                                <span>{isPlayingAudio ? '0:07' : '0:00'}</span>
                                <span className="text-emerald-400">{msg.audioDuration}</span>
                              </div>
                            </div>
                            <Mic className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          </div>
                        ) : (
                          /* Text Message */
                          msg.text && (
                            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal mb-1">
                              {msg.text}
                            </p>
                          )
                        )}

                        {/* Real-time Location Card */}
                        {msg.location && (
                          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 mt-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                                  msg.location.isLive
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/10 text-slate-300'
                                )}
                              >
                                {msg.location.isLive ? (
                                  <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
                                ) : (
                                  <MapPin className="w-4 h-4 text-rose-400" />
                                )}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-white">
                                  {msg.location.title}
                                </div>
                                <div className="text-[11px] text-slate-400 line-clamp-1">
                                  {msg.location.subtitle}
                                </div>
                              </div>
                            </div>

                            {msg.location.isLive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold tracking-wider border border-emerald-500/30 flex-shrink-0">
                                EN VIVO
                              </span>
                            )}
                          </div>
                        )}

                        {/* Read Receipt (Blue Double Check) */}
                        <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-slate-400">
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp Authentic Input Bar */}
              <div className="bg-[#0F1D36] p-3 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-400 pl-1">
                  <Smile className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                  <Paperclip className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                </div>
                <div className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-sans">
                  Canal activo de validación piloto · Santa Cruz de la Sierra
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 font-bold shadow-md hover:scale-105 transition-transform cursor-pointer">
                  <Mic className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
