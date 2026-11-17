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
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

interface InstagramFeatureCard {
  tag: string;
  tagColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  ctaText: string;
  animationType: 'sparkle' | 'equalizer' | 'rec' | 'radar';
}

const INSTAGRAM_THEMES: InstagramFeatureCard[] = [
  {
    tag: 'INNOVACIÓN · PRODUCTO',
    tagColor: '#00E5BE',
    icon: Sparkles,
    iconBg: 'rgba(0, 229, 190, 0.15)',
    iconColor: '#00E5BE',
    title: 'Novedades de URBO',
    description: 'Actualizaciones directas sobre el sistema en tiempo real, nuevas funciones en desarrollo y la hoja de ruta de cobertura urbana.',
    ctaText: 'Ver lanzamientos',
    animationType: 'sparkle',
  },
  {
    tag: 'MÉTRICAS & RESULTADOS',
    tagColor: '#38BDF8',
    icon: TrendingUp,
    iconBg: 'rgba(56, 189, 248, 0.15)',
    iconColor: '#38BDF8',
    title: 'Avances del Piloto',
    description: 'Datos reales de telemetría en calle, reducción de tiempos de espera de pasajeros y lecciones aprendidas durante meses de pruebas continuas.',
    ctaText: 'Ver mediciones',
    animationType: 'equalizer',
  },
  {
    tag: 'EN CABINA · REELS',
    tagColor: '#F472B6',
    icon: Video,
    iconBg: 'rgba(244, 114, 182, 0.15)',
    iconColor: '#F472B6',
    title: 'Videos de Campo',
    description: 'Grabaciones de la vida a bordo del micro, pruebas del asistente por voz manos libres para choferes y recorridos en avenidas troncales.',
    ctaText: 'Ver videos en ruta',
    animationType: 'rec',
  },
  {
    tag: 'SANTA CRUZ · PASAJEROS',
    tagColor: '#FBBF24',
    icon: Users,
    iconBg: 'rgba(251, 191, 36, 0.15)',
    iconColor: '#FBBF24',
    title: 'Comunidad y Movilidad',
    description: 'Historias de vecinos de Santa Cruz de la Sierra, diálogo abierto sobre transporte público y cómo construimos una ciudad más conectada.',
    ctaText: 'Conocer historias',
    animationType: 'radar',
  },
];

// ── Sparkle overlay: 3 floating particles that drift and fade in loop
const SparkleAnimation: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="animate-ambient-drift absolute rounded-full"
        style={{
          width: 4 + i * 2,
          height: 4 + i * 2,
          background: color,
          opacity: 0.6,
          left: `${20 + i * 28}%`,
          top: `${30 + i * 15}%`,
          animationDelay: `${i * 0.9}s`,
          animationDuration: `${3.2 + i * 0.6}s`,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    ))}
  </div>
);

// ── Equalizer: 4 pulsing bars synced to telemetry rhythm
const EqualizerAnimation: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute bottom-14 right-5 flex items-end gap-[3px] pointer-events-none">
    {(['animate-equalizer-1', 'animate-equalizer-2', 'animate-equalizer-3', 'animate-equalizer-4'] as const).map(
      (cls, i) => (
        <div
          key={i}
          className={`${cls} rounded-sm`}
          style={{
            width: 4,
            background: color,
            opacity: 0.75,
            minHeight: 6,
          }}
        />
      )
    )}
  </div>
);

// ── REC dot: blinking live recording indicator
const RecAnimation: React.FC = () => (
  <div className="absolute top-5 right-5 flex items-center gap-1.5 pointer-events-none">
    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.9)]" />
    <span className="text-[9px] font-mono font-bold text-red-400 tracking-widest uppercase">REC</span>
  </div>
);

// ── Radar: concentric expanding ring ping
const RadarAnimation: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute bottom-14 right-5 pointer-events-none">
    <div
      className="animate-radar-wave absolute rounded-full border"
      style={{ width: 32, height: 32, top: -16, left: -16, borderColor: color, opacity: 0.5 }}
    />
    <div
      className="animate-radar-wave absolute rounded-full border"
      style={{ width: 32, height: 32, top: -16, left: -16, borderColor: color, opacity: 0.5, animationDelay: '0.8s' }}
    />
    <div
      className="rounded-full"
      style={{ width: 8, height: 8, background: color, boxShadow: `0 0 10px ${color}` }}
    />
  </div>
);

function CardAnimation({ type, color }: { type: InstagramFeatureCard['animationType']; color: string }) {
  if (type === 'sparkle') return <SparkleAnimation color={color} />;
  if (type === 'equalizer') return <EqualizerAnimation color={color} />;
  if (type === 'rec') return <RecAnimation />;
  if (type === 'radar') return <RadarAnimation color={color} />;
  return null;
}

export const InstagramGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        '.instagram-header',
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

      // Cards staggered entrance
      gsap.fromTo(
        '.instagram-theme-card',
        { opacity: 0, y: 28, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: motion.duration.normal,
          stagger: 0.09,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Footer footer card entrance
      gsap.fromTo(
        '.instagram-footer-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: motion.duration.normal,
          ease: motion.ease.enter,
          scrollTrigger: {
            trigger: '.instagram-footer-card',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Ambient orbs drift continuously while visible (using ScrollTrigger pin-spacer trick)
      gsap.to('.ig-orb-pink', {
        x: 30,
        y: -20,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
      gsap.to('.ig-orb-teal', {
        x: -25,
        y: 15,
        duration: 7.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.5,
      });

      // Badge radar glow pulse on the @urbo.corp badge
      gsap.to('.ig-badge-dot', {
        scale: 1.5,
        opacity: 0.4,
        duration: 1.1,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
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
        className="ig-orb-pink absolute top-1/4 -right-20 w-[550px] h-[550px] rounded-full bg-pink-500/10 blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="ig-orb-teal absolute bottom-10 -left-20 w-[500px] h-[500px] rounded-full bg-[#00C9A7]/10 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="instagram-header flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-6">
          <div className="max-w-2xl">
            {/* Badge with radar dot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070E1E] border border-white/10 text-white text-xs font-mono font-bold tracking-wider uppercase mb-4 relative">
              <span className="ig-badge-dot w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]" />
              {/* Radar ring around the dot */}
              <span className="animate-radar-wave absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-pink-400 pointer-events-none" />
              <span>COMUNIDAD EN REDES · @URBO.CORP</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-tech">
              La movilidad de Santa Cruz,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bc1888] via-[#dc2743] to-[#00E5BE] font-tech">
                en nuestro Instagram.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-sans">
              Acompáñanos en las pruebas de campo, conoce a los choferes y pasajeros que construyen URBO día a día, y mantente al tanto de cada nuevo avance en la ciudad.
            </p>
          </div>

          {/* Action CTAs */}
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
              <span>Ver novedades</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* 4 Thematic Cards with live animation overlays */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {INSTAGRAM_THEMES.map((theme, i) => {
            const Icon = theme.icon;
            return (
              <a
                key={i}
                href="https://www.instagram.com/urbo.corp/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-theme-card group flex flex-col justify-between p-7 rounded-3xl bg-[#070E1E] border border-white/10 hover:border-pink-500/40 hover:shadow-[0_20px_45px_rgba(225,48,108,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle corner aura */}
                <div
                  className="absolute top-0 right-0 w-28 h-28 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ background: theme.tagColor }}
                />

                {/* Living ambient animation overlay */}
                <CardAnimation type={theme.animationType} color={theme.tagColor} />

                <div>
                  {/* Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105"
                      style={{
                        background: theme.iconBg,
                        borderColor: `${theme.iconColor}40`,
                        color: theme.iconColor,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border"
                      style={{
                        color: theme.tagColor,
                        borderColor: `${theme.tagColor}30`,
                        background: `${theme.tagColor}10`,
                      }}
                    >
                      {theme.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-pink-300 transition-colors leading-snug font-tech">
                    {theme.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-6">
                    {theme.description}
                  </p>
                </div>

                {/* Footer link */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                    {theme.ctaText}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Official Brand Anchor Footer Card */}
        <div className="instagram-footer-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F1C35]/90 via-[#0B1426]/90 to-[#070B14]/90 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-lg">
              <Instagram className="w-6 h-6 fill-current stroke-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold text-white font-tech">
                  @urbo.corp en Instagram
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00E5BE] bg-[#00C9A7]/15 px-2 py-0.5 rounded-full border border-[#00C9A7]/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Oficial</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                La cuenta oficial de telemetría, historias y desarrollo de URBO en Santa Cruz de la Sierra.
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/urbo.corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#070B14] hover:bg-slate-200 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0"
          >
            <span>Ir al Instagram oficial</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default InstagramGallery;
