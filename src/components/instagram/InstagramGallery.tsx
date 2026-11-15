import React, { useRef, useEffect } from 'react';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  ExternalLink, 
  Play, 
  MapPin, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

interface InstagramPost {
  id: string;
  type: 'reel' | 'post';
  title: string;
  caption: string;
  location: string;
  viewsOrLikes: string;
  comments: string;
  tag: string;
  bgGradient: string;
  url: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    type: 'reel',
    title: 'Don Neyer probando el aviso por voz en cabina',
    caption: 'Recorrido en vivo por el Casco Viejo con la Línea 30. Así suena la alerta automática a 300 metros sin tocar el teléfono.',
    location: 'Plaza 24 de Septiembre · Casco Viejo SCZ',
    viewsOrLikes: '18.4K views',
    comments: '84',
    tag: 'REEL · PRUEBA EN RUTA',
    bgGradient: 'from-[#0F1D36] via-[#162744] to-[#0A1220]',
    url: 'https://www.instagram.com/urbo.corp/',
  },
  {
    id: 'ig-2',
    type: 'post',
    title: '140 vecinos coordinando el micro a diario',
    caption: '5 meses de validación continua en la zona norte de Santa Cruz. La demanda de información en tiempo real es urgente y masiva.',
    location: 'Av. Banzer y 3er Anillo',
    viewsOrLikes: '640 likes',
    comments: '52',
    tag: 'COMUNIDAD · VALIDACIÓN',
    bgGradient: 'from-[#122338] via-[#0E1B2D] to-[#070D18]',
    url: 'https://www.instagram.com/urbo.corp/',
  },
  {
    id: 'ig-3',
    type: 'reel',
    title: 'Cómo funciona el Modo "Esperar Aquí"',
    caption: 'Un toque en tu teléfono antes de salir de casa. El chofer recibe la notificación acústica y desacelera con anticipación.',
    location: 'Santa Cruz de la Sierra',
    viewsOrLikes: '24.1K views',
    comments: '138',
    tag: 'TECNOLOGÍA · MANOS LIBRES',
    bgGradient: 'from-[#0B1A2C] via-[#152840] to-[#0D1826]',
    url: 'https://www.instagram.com/urbo.corp/',
  },
  {
    id: 'ig-4',
    type: 'post',
    title: 'Don Mauricio: "Entre todos podemos lograrlo"',
    caption: 'Charla en parada con los conductores de la Línea 30 sobre el impacto de la telemetría abierta en el transporte público.',
    location: 'Parada Norte · Línea 30',
    viewsOrLikes: '495 likes',
    comments: '41',
    tag: 'HISTORIAS · LÍNEA 30',
    bgGradient: 'from-[#0E1D33] via-[#1A2E4C] to-[#0B1526]',
    url: 'https://www.instagram.com/urbo.corp/',
  },
];

export const InstagramGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.instagram-header',
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
        '.instagram-card',
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
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="instagram" 
      className="relative py-20 lg:py-28 overflow-hidden bg-[#070B14] text-white transition-colors duration-300"
    >
      {/* Subtle background ambient lights */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-20 w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -left-20 w-[550px] h-[550px] rounded-full bg-[#00C9A7]/10 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="instagram-header flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1426] border border-white/10 text-white text-xs font-mono font-bold tracking-wider uppercase mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] animate-pulse" />
              <span>CANAL OFICIAL · @URBO.CORP</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-tech">
              La calle en video.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bc1888] via-[#dc2743] to-[#00E5BE] font-tech">
                En nuestro Instagram.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mt-2 leading-relaxed font-sans">
              Seguimiento de campo en el Casco Viejo con la Línea 30, pruebas de voz en cabina y novedades de la movilidad urbana en Santa Cruz de la Sierra.
            </p>
          </div>

          <a
            href="https://www.instagram.com/urbo.corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:shadow-[0_0_25px_rgba(253,29,29,0.35)] w-fit"
          >
            <Instagram className="w-4 h-4 fill-current stroke-none" />
            <span>Seguir a @urbo.corp</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* 4 Instagram Feed Preview Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-card group flex flex-col justify-between rounded-3xl overflow-hidden bg-[#0B1426] border border-white/10 shadow-xl hover:border-pink-500/40 hover:shadow-[0_20px_45px_rgba(225,48,108,0.15)] hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Card Top: Instagram Profile Header */}
              <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#0F1C35]/60">
                <div className="flex items-center gap-2.5">
                  {/* Avatar with authentic Instagram gradient ring */}
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-sm">
                    <div className="p-0.5 bg-[#070B14] rounded-full">
                      <UrboLogo size={28} className="rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>urbo.corp</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Santa Cruz, Bolivia</div>
                  </div>
                </div>

                <Instagram className="w-4 h-4 text-slate-400 group-hover:text-[#dc2743] transition-colors" />
              </div>

              {/* Card Center: Visual Mockup Container */}
              <div className={cn('relative aspect-square flex flex-col justify-between p-5 bg-gradient-to-b text-white overflow-hidden', post.bgGradient)}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:16px_16px]" />

                {/* Top Badge: Type / Reel */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-[9px] font-mono font-bold uppercase tracking-wider text-[#00E5BE] backdrop-blur-md">
                    {post.tag}
                  </span>

                  {post.type === 'reel' && (
                    <div className="w-7 h-7 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Center Overlay: Headline preview */}
                <div className="relative z-10 my-auto text-center py-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#00C9A7]/20 border border-[#00C9A7]/40 flex items-center justify-center text-[#00E5BE] mb-3 shadow-[0_0_20px_rgba(0,201,167,0.3)] group-hover:scale-110 transition-transform">
                    {post.type === 'reel' ? <Play className="w-6 h-6 fill-current ml-0.5" /> : <Sparkles className="w-6 h-6" />}
                  </div>
                  <h4 className="text-sm font-bold leading-snug px-2 text-white font-sans drop-shadow-md">
                    {post.title}
                  </h4>
                </div>

                {/* Bottom Overlay: Location pill */}
                <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-md w-fit">
                  <MapPin className="w-3 h-3 text-[#00E5BE] flex-shrink-0" />
                  <span className="truncate">{post.location}</span>
                </div>
              </div>

              {/* Card Bottom: Instagram Interactions & Caption */}
              <div className="p-4 flex flex-col justify-between flex-1 bg-[#0B1426]">
                {/* Action Icons */}
                <div className="flex items-center justify-between mb-3 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 hover:text-[#dc2743] hover:fill-[#dc2743] transition-colors" />
                    <MessageCircle className="w-4 h-4 hover:text-white transition-colors" />
                    <Send className="w-4 h-4 hover:text-[#00E5BE] transition-colors" />
                  </div>
                  <Bookmark className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                </div>

                {/* Stats */}
                <div className="text-[11px] font-mono font-bold text-[#00E5BE] mb-1.5">
                  {post.viewsOrLikes} · {post.comments} comentarios
                </div>

                {/* Caption */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3 font-sans">
                  <strong className="text-white font-semibold mr-1 font-mono">urbo.corp</strong>
                  {post.caption}
                </p>

                {/* Action Link */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-[#00E5BE] group-hover:text-white transition-colors">
                  <span>Ver en Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
