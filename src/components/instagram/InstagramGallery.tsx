import React, { useRef, useEffect } from 'react';
import { 
  Instagram, 
  ExternalLink, 
  Play, 
  MapPin, 
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Radio,
  Video,
  Layers,
  Compass,
  MessageSquare
} from 'lucide-react';
import { GlassBadge } from '@/components/ui/Glass';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';

gsap.registerPlugin(ScrollTrigger);

interface InstagramChannelItem {
  id: string;
  type: 'reel' | 'post' | 'story';
  title: string;
  category: string;
  description: string;
  location: string;
  badge: string;
  badgeColor: string;
  url: string;
}

const OFFICIAL_CHANNELS: InstagramChannelItem[] = [
  {
    id: 'ch-1',
    type: 'reel',
    title: 'Telemetría por Voz en Cabina',
    category: 'REELS · PRUEBAS EN RUTA',
    description: 'Videos en vivo recorriendo el Casco Viejo con los conductores de la Línea 30. Demostración del aviso acústico a 300 metros.',
    location: 'Plaza 24 de Septiembre · Casco Viejo SCZ',
    badge: 'Video en Ruta',
    badgeColor: 'text-[#00E5BE] bg-[#00C9A7]/15 border-[#00C9A7]/30',
    url: 'https://www.instagram.com/urbo.corp/',
  },
  {
    id: 'ch-2',
    type: 'post',
    title: 'Validación Vecinal Zona Norte',
    category: 'COMUNIDAD · PASAJEROS',
    description: 'Documentación de las 140 personas que utilizaron el prototipo continuo de consulta durante 5 meses de pruebas en Santa Cruz.',
    location: 'Av. Banzer y Tercer Anillo',
    badge: 'Trabajo de Campo',
    badgeColor: 'text-[#38BDF8] bg-[#38BDF8]/15 border-[#38BDF8]/30',
    url: 'https://www.instagram.com/urbo.corp/',
  },
  {
    id: 'ch-3',
    type: 'reel',
    title: 'Función Esperar Aquí en Detalle',
    category: 'TECNOLOGÍA · MANOS LIBRES',
    description: 'Explicación del sistema de parada anticipada para reducir los 35 minutos diarios de espera en esquinas sin información.',
    location: 'Santa Cruz de la Sierra',
    badge: 'Producto',
    badgeColor: 'text-[#F4C430] bg-[#F4C430]/15 border-[#F4C430]/30',
    url: 'https://www.instagram.com/urbo.corp/',
  },
  {
    id: 'ch-4',
    type: 'post',
    title: 'Historias de Choferes de Línea',
    category: 'DIÁLOGOS · TRANSPORTE',
    description: 'Conversaciones directas sobre la dignidad laboral de los choferes y cómo la tecnología simple mejora sus condiciones de trabajo.',
    location: 'Parada Norte · Línea 30',
    badge: 'Testimonios',
    badgeColor: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
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
        '.instagram-channel-card',
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
      {/* Background ambient lighting */}
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

            {/* Official Meta API Connection Status Note */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Sincronización API oficial Meta en espera de credenciales empresariales · Enlace público verificado activo</span>
            </div>
          </div>

          <a
            href="https://www.instagram.com/urbo.corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:shadow-[0_0_25px_rgba(253,29,29,0.35)] w-fit"
          >
            <Instagram className="w-4 h-4 fill-current stroke-none" />
            <span>Ver perfil @urbo.corp</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* 4 Authentic Content Channel Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OFFICIAL_CHANNELS.map((ch) => (
            <a
              key={ch.id}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-channel-card group flex flex-col justify-between rounded-3xl overflow-hidden bg-[#0B1426] border border-white/10 shadow-xl hover:border-pink-500/40 hover:shadow-[0_20px_45px_rgba(225,48,108,0.15)] hover:-translate-y-1.5 transition-all duration-300 p-6"
            >
              <div>
                {/* Header: Tag badge & external icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className={cn('text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border', ch.badgeColor)}>
                    {ch.badge}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-gradient-to-tr group-hover:from-[#f09433] group-hover:via-[#dc2743] group-hover:to-[#bc1888] flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Channel Category */}
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                  {ch.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-pink-300 transition-colors">
                  {ch.title}
                </h3>

                {/* Authentic Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                  {ch.description}
                </p>
              </div>

              {/* Bottom footer: Location & action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                  <MapPin className="w-3.5 h-3.5 text-[#00E5BE] shrink-0" />
                  <span className="truncate">{ch.location}</span>
                </span>
                <span className="text-white group-hover:text-pink-400 font-bold transition-colors">
                  Ver post →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Direct Link to Chat / Direct Message */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#0F1C35] via-[#0B1426] to-[#0F1C35] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">¿Tienes preguntas sobre el piloto o quieres sumar tu línea?</h4>
              <p className="text-xs text-slate-300 font-sans">Escríbenos directamente por mensaje directo en Instagram o contacta a los fundadores.</p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/direct/t/urbo.corp"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold transition-all shrink-0 hover:scale-105"
          >
            Enviar DM en Instagram
          </a>
        </div>

      </div>
    </section>
  );
};

export default InstagramGallery;
