import React, { useRef, useEffect } from 'react';
import {
  Instagram,
  ExternalLink,
  Video,
  Sparkles,
  ArrowUpRight,
  Users,
  TrendingUp,
  CheckCircle2,
  Compass,
  Radio,
  Share2,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

interface InstagramFeature {
  tag: string;
  tagColor: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  ctaText: string;
  type: 'rec' | 'equalizer' | 'radar';
}

const INSTAGRAM_FEATURES: InstagramFeature[] = [
  {
    tag: 'EN CABINA · REELS',
    tagColor: '#F472B6',
    icon: Video,
    iconColor: '#F472B6',
    iconBg: 'rgba(244, 114, 182, 0.15)',
    title: 'Videos en Ruta y Pruebas de Cabina',
    description: 'Grabaciones de las pruebas en avenidas troncales, uso del asistente pasivo por voz para choferes y validación de paradas en vivo.',
    metric: '100% Manos Libres',
    metricLabel: 'Asistencia acústica a bordo',
    ctaText: 'Ver videos en ruta',
    type: 'rec',
  },
  {
    tag: 'TELEMETRÍA · DATOS REALES',
    tagColor: '#38BDF8',
    icon: TrendingUp,
    iconColor: '#38BDF8',
    iconBg: 'rgba(56, 189, 248, 0.15)',
    title: 'Métricas y Resultados del Piloto',
    description: 'Reportes de campo semanales: tiempos de espera reducidos, frecuencia de paso en horas pico y telemetría de geolocalización satelital.',
    metric: '-35% Espera',
    metricLabel: 'Medición de impacto en paradas',
    ctaText: 'Ver reportes de datos',
    type: 'equalizer',
  },
  {
    tag: 'COMUNIDAD · SANTA CRUZ',
    tagColor: '#00E5BE',
    icon: Users,
    iconColor: '#00E5BE',
    iconBg: 'rgba(0, 229, 190, 0.15)',
    title: 'Historias de Choferes y Pasajeros',
    description: 'Testimonios reales de vecinos que usan micros todos los días en el Casco Viejo, Monseñor Rivero y los Anillos metropolitanos.',
    metric: '140+ Pasajeros',
    metricLabel: 'Participando en el piloto',
    ctaText: 'Conocer historias',
    type: 'radar',
  },
];

export const InstagramGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        '.ig-header',
        { opacity: 0, y: 24 },
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

      // Spotlight profile card entrance
      gsap.fromTo(
        '.ig-spotlight-card',
        { opacity: 0, x: -30, scale: 0.96 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: motion.duration.normal,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Feature cards staggered entrance
      gsap.fromTo(
        '.ig-feature-card',
        { opacity: 0, x: 30, scale: 0.96 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: motion.duration.normal,
          stagger: 0.1,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Continuous ambient orbs drift
      gsap.to('.ig-ambient-orb-1', {
        x: 40,
        y: -30,
        duration: 7,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
      gsap.to('.ig-ambient-orb-2', {
        x: -35,
        y: 25,
        duration: 8.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1,
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="instagram"
      className="relative py-20 lg:py-28 overflow-hidden bg-[#070B14] text-white transition-colors duration-300"
    >
      {/* Drifting ambient orbs */}
      <div
        aria-hidden="true"
        className="ig-ambient-orb-1 absolute top-1/4 -right-24 w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="ig-ambient-orb-2 absolute bottom-10 -left-24 w-[550px] h-[550px] rounded-full bg-[#00C9A7]/10 blur-[170px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="ig-header flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070E1E] border border-white/10 text-white text-xs font-mono font-bold tracking-wider uppercase mb-4 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] animate-pulse" />
              <span>CANAL OFICIAL DE COMUNIDAD · @URBO.CORP</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-tech">
              La movilidad de Santa Cruz,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bc1888] via-[#dc2743] to-[#00E5BE] font-tech">
                vivida desde adentro.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-sans">
              Acompaña las pruebas de campo en cabina, conoce a los choferes y pasajeros que construyen URBO, y sé parte de la transformación del transporte público en Santa Cruz.
            </p>
          </div>

          {/* Action Header CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://www.instagram.com/urbo.corp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:shadow-[0_0_25px_rgba(253,29,29,0.35)] cursor-pointer"
            >
              <Instagram className="w-4 h-4 fill-current stroke-none" />
              <span>Seguir a @urbo.corp</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>

            <a
              href="https://www.instagram.com/urbo.corp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-slate-200 hover:text-white font-medium text-xs sm:text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span>Ver últimas publicaciones</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* =================================================================
            EDITORIAL MAGAZINE LAYOUT: 1 SPOTLIGHT PROFILE + 3 THEMATIC CARDS
            ================================================================= */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: Spotlight Official Profile Card (5 cols on lg) */}
          <div className="ig-spotlight-card lg:col-span-5 p-8 rounded-3xl bg-gradient-to-b from-[#0F1C35]/95 via-[#0B1426]/95 to-[#070B14]/98 border border-white/15 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden group">
            
            {/* Top gradient glow */}
            <div 
              aria-hidden="true" 
              className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br from-[#bc1888]/20 via-[#dc2743]/15 to-transparent blur-3xl pointer-events-none" 
            />

            <div>
              {/* Profile Bar */}
              <div className="flex items-center gap-4 mb-6">
                {/* Avatar with animated gradient story ring */}
                <div className="relative w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shrink-0">
                  <div className="w-full h-full rounded-full bg-[#070B14] flex items-center justify-center p-2.5">
                    <Instagram className="w-7 h-7 text-white fill-current stroke-none" />
                  </div>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-tech text-xl font-black text-white tracking-wide">
                      urbo.corp
                    </span>
                    <span className="inline-flex text-[#00E5BE] bg-[#00C9A7]/15 p-0.5 rounded-full border border-[#00C9A7]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 block mt-0.5">
                    URBO · Movilidad en Tiempo Real
                  </span>
                  <span className="text-[10px] font-mono text-[#00E5BE] font-semibold">
                    Santa Cruz de la Sierra, Bolivia
                  </span>
                </div>
              </div>

              {/* Bio & Purpose */}
              <p className="text-sm text-slate-200 leading-relaxed font-sans mb-6 text-left">
                La cuenta oficial de telemetría, historias de campo y avances tecnológicos de URBO. Conectamos los micros de la ciudad con datos precisos, dignos y transparentes.
              </p>

              {/* Real Telemetry Numbers */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 text-center font-mono">
                <div>
                  <span className="text-lg sm:text-xl font-black text-[#00E5BE] block font-tech">140+</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Pasajeros</span>
                </div>
                <div className="border-x border-white/10">
                  <span className="text-lg sm:text-xl font-black text-[#38BDF8] block font-tech">1.2K+</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Consultas</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black text-[#F4C430] block font-tech">9.5 KM</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Corredor</span>
                </div>
              </div>
            </div>

            {/* Direct Channel Action */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <a
                href="https://www.instagram.com/urbo.corp/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] shadow-lg hover:shadow-[0_0_25px_rgba(253,29,29,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Instagram className="w-4 h-4 fill-current stroke-none" />
                <span>Seguir a @urbo.corp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                <span>Actualizaciones semanales</span>
                <span className="text-[#00E5BE] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE] animate-ping" />
                  Activo hoy
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT: 3 Editorial Feature Cards (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-5 justify-between">
            {INSTAGRAM_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <a
                  key={i}
                  href="https://www.instagram.com/urbo.corp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-feature-card group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-7 rounded-3xl bg-[#070E1E] border border-white/10 hover:border-white/30 hover:bg-[#0B1426] transition-all duration-300 shadow-lg relative overflow-hidden text-left"
                >
                  {/* Subtle corner aura */}
                  <div
                    aria-hidden="true"
                    className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                    style={{ background: feat.tagColor }}
                  />

                  {/* Icon & Details */}
                  <div className="flex items-start gap-5 max-w-xl">
                    <div
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
                      style={{
                        background: feat.iconBg,
                        borderColor: `${feat.iconColor}40`,
                        color: feat.iconColor,
                      }}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    <div>
                      {/* Tag & Animation Pill */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
                          style={{
                            color: feat.tagColor,
                            borderColor: `${feat.tagColor}35`,
                            background: `${feat.tagColor}12`,
                          }}
                        >
                          {feat.tag}
                        </span>

                        {/* Feature Animation Indicator */}
                        {feat.type === 'rec' && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>REC · CABINA</span>
                          </span>
                        )}

                        {feat.type === 'equalizer' && (
                          <div className="flex items-end gap-[2px] h-3 px-1">
                            <span className="w-1 h-3 bg-[#38BDF8] animate-pulse rounded-full" />
                            <span className="w-1 h-2 bg-[#38BDF8] animate-pulse rounded-full delay-100" />
                            <span className="w-1 h-3.5 bg-[#38BDF8] animate-pulse rounded-full delay-200" />
                          </div>
                        )}

                        {feat.type === 'radar' && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-[#00E5BE] bg-[#00E5BE]/10 px-2 py-0.5 rounded-full border border-[#00E5BE]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE] animate-ping" />
                            <span>EN VIVO</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00E5BE] transition-colors leading-snug font-tech">
                        {feat.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-1.5">
                        {feat.description}
                      </p>

                      {/* Metric Tag */}
                      <div className="flex items-center gap-2 mt-3 text-xs font-mono">
                        <span className="font-bold text-white font-tech" style={{ color: feat.tagColor }}>
                          {feat.metric}
                        </span>
                        <span className="text-slate-400">· {feat.metricLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow CTA */}
                  <div className="mt-4 sm:mt-0 sm:ml-4 shrink-0 p-3 rounded-full bg-white/5 border border-white/10 text-slate-300 group-hover:text-white group-hover:bg-white/10 group-hover:translate-x-1 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default InstagramGallery;
