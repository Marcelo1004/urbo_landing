import React, { useRef, useEffect, useState } from 'react';
import { 
  Instagram, 
  ExternalLink, 
  Video, 
  Image as ImageIcon,
  Calendar,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Radio,
  Users,
  ShieldCheck,
  Compass,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';
import { InstagramPost } from '@/services/instagramTypes';
import { fetchInstagramFeed } from '@/services/instagramClient';

gsap.registerPlugin(ScrollTrigger);

export const InstagramGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [feedSource, setFeedSource] = useState<string>('pending_authorization');
  const [lastUpdated, setLastUpdated] = useState<string>('En espera de token');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch feed from secure backend endpoint /api/instagram/feed
  useEffect(() => {
    let isMounted = true;

    async function loadFeed() {
      setIsRefreshing(true);
      const res = await fetchInstagramFeed();
      if (isMounted) {
        setIsAuthenticated(res.authenticated);
        setFeedSource(res.source);
        if (res.posts && res.posts.length > 0) {
          setPosts(res.posts);
          setLastUpdated(
            new Date(res.lastUpdated).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
          );
        } else {
          setPosts([]);
        }
        setIsRefreshing(false);
      }
    }

    loadFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP ScrollTrigger reveal animations
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        '.instagram-hub-card',
        { opacity: 0, y: 28, scale: 0.98 },
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
  }, [posts]);

  const hasLivePosts = isAuthenticated && posts.length > 0;
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

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

            {/* Live Sync Status Banner */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5BE]" />
                <span>Backend API: /api/instagram/feed</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <RefreshCw className={cn("w-3 h-3 text-[#38BDF8]", isRefreshing && "animate-spin")} />
                <span>
                  {hasLivePosts ? `Actualizado: ${lastUpdated}` : 'Modo Seguro: Sin datos ficticios'}
                </span>
              </span>
              <span className="text-white/40">·</span>
              <span className={hasLivePosts ? "text-[#00E5BE]" : "text-amber-400"}>
                {hasLivePosts ? "Sincronización activa" : "Enlace directo oficial a @urbo.corp"}
              </span>
            </div>
          </div>

          {/* Follow button opening the official profile */}
          <a
            href="https://www.instagram.com/urbo.corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:shadow-[0_0_25px_rgba(253,29,29,0.35)] w-fit shrink-0 cursor-pointer"
          >
            <Instagram className="w-4 h-4 fill-current stroke-none" />
            <span>Seguir a @urbo.corp</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* Content Layout: Authenticated Live Feed OR Sober Official Channel Hub */}
        {hasLivePosts ? (
          <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Featured Post Card */}
            <div className="lg:col-span-5 flex">
              <a
                href={featuredPost.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-hub-card group w-full flex flex-col justify-between rounded-3xl overflow-hidden bg-[#0B1426] border border-white/10 hover:border-pink-500/50 hover:shadow-[0_20px_45px_rgba(225,48,108,0.2)] transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#0F1C35] via-[#111C38] to-[#070B14]">
                  <img
                    src={featuredPost.mediaUrl}
                    alt={featuredPost.category || 'URBO'}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white shadow-lg">
                    {featuredPost.isReel ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-pink-400" />
                        <span>REEL DESTACADO</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3.5 h-3.5 text-[#00E5BE]" />
                        <span>PUBLICACIÓN</span>
                      </>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-gradient-to-tr group-hover:from-[#f09433] group-hover:via-[#dc2743] group-hover:to-[#bc1888] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2.5">
                      <span className="text-[#00E5BE] font-bold uppercase tracking-wider">
                        {featuredPost.category || 'CONTENIDO OFICIAL'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{featuredPost.formattedDate}</span>
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans font-medium line-clamp-3 group-hover:text-white transition-colors">
                      {featuredPost.caption}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">@urbo.corp en Instagram</span>
                    <span className="text-[#00E5BE] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Abrir publicación <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            </div>

            {/* Grid of Remaining Posts */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-hub-card group flex flex-col justify-between rounded-3xl overflow-hidden bg-[#0B1426] border border-white/10 hover:border-pink-500/40 hover:shadow-[0_15px_35px_rgba(225,48,108,0.15)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#0F1C35] via-[#111C38] to-[#070B14]">
                    <img
                      src={post.thumbnailUrl || post.mediaUrl}
                      alt={post.category || 'URBO'}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-transparent to-transparent opacity-60" />

                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-white">
                      {post.isReel ? (
                        <>
                          <Video className="w-3 h-3 text-pink-400" />
                          <span>REEL</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3 text-[#00E5BE]" />
                          <span>POST</span>
                        </>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-pink-600 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                        <span className="text-[#38BDF8] font-semibold truncate max-w-[120px]">
                          {post.category || 'URBO'}
                        </span>
                        <span>{post.formattedDate}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3 group-hover:text-slate-100 transition-colors">
                        {post.caption}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>@urbo.corp</span>
                      <span className="text-[#00E5BE] font-bold group-hover:text-white transition-colors">
                        Ver post
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

          </div>
        ) : (
          /* =================================================================
              SOBER OFFICIAL INSTAGRAM HUB (STRICTLY NO SIMULATED STOCK PHOTOS)
              ================================================================= */
          <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Primary Channel Anchor Card (Cols 1-5) */}
            <div className="lg:col-span-5 flex">
              <a
                href="https://www.instagram.com/urbo.corp/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-hub-card group w-full flex flex-col justify-between rounded-[32px] p-7 sm:p-9 bg-gradient-to-b from-[#0F1C35] via-[#0B1426] to-[#070B14] border-2 border-pink-500/30 hover:border-pink-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(225,48,108,0.15)] transition-all duration-300 relative overflow-hidden"
              >
                {/* Ambient glow accent */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-[0_0_25px_rgba(225,48,108,0.4)] group-hover:scale-105 transition-transform">
                      <Instagram className="w-7 h-7 fill-current stroke-none" />
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-mono border border-white/15">
                      <span>Canal Oficial</span>
                      <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold tracking-widest text-pink-400 uppercase font-tech block mb-1">
                    CANAL DE TELEMETRÍA EN VIVO
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-tech leading-snug">
                    @urbo.corp en Instagram
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6">
                    Mira las pruebas en cabina, testimonios de conductores y el seguimiento de micros en tiempo real directamente en nuestra cuenta oficial.
                  </p>
                </div>

                <div>
                  <div className="p-4 rounded-2xl bg-[#070B14]/90 border border-white/10 mb-6">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
                      <span className="text-[#00E5BE] font-bold">LÍNEA 30 · CORREDOR NORTE</span>
                      <span className="text-slate-400">Santa Cruz</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      Historias destacadas con la experiencia de choferes y pasajeros durante 5 meses de pruebas en ruta.
                    </p>
                  </div>

                  <div className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-sm shadow-lg group-hover:shadow-[0_0_25px_rgba(253,29,29,0.4)] transition-all">
                    <span>Abrir perfil oficial @urbo.corp</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </a>
            </div>

            {/* 3 Authentic Editorial Content Pillars (Cols 6-12) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              
              {/* Pillar 1: Pruebas en Cabina */}
              <a
                href="https://www.instagram.com/urbo.corp/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-hub-card group p-6 rounded-3xl bg-[#0B1426] border border-white/10 hover:border-[#00E5BE]/40 hover:bg-[#0E1A33] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#00C9A7]/20 text-[#00E5BE] flex items-center justify-center shrink-0 border border-[#00C9A7]/30 shadow-md">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#00E5BE] tracking-wider block">
                      TELEMETRÍA EN RUTA
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00E5BE] transition-colors leading-snug">
                      Alertas de voz a 300 metros sin pantallas al volante
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                      Reels con grabaciones reales de choferes conduciendo de forma segura en el Casco Viejo.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#00E5BE] flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <span>Ver videos</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>

              {/* Pillar 2: Comunidad & Pasajeros */}
              <a
                href="https://www.instagram.com/urbo.corp/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-hub-card group p-6 rounded-3xl bg-[#0B1426] border border-white/10 hover:border-[#38BDF8]/40 hover:bg-[#0E1A33] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center shrink-0 border border-[#38BDF8]/30 shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#38BDF8] tracking-wider block">
                      COMUNIDAD DE PASAJEROS
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                      Eliminando la espera a ciegas en las paradas
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                      140 vecinos de Santa Cruz compartiendo cómo planifican su salida conociendo el paso exacto del micro.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#38BDF8] flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <span>Ver historias</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>

              {/* Pillar 3: Alianzas & Expansión */}
              <a
                href="https://www.instagram.com/urbo.corp/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-hub-card group p-6 rounded-3xl bg-[#0B1426] border border-white/10 hover:border-pink-500/40 hover:bg-[#0E1A33] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30 shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-pink-400 tracking-wider block">
                      LÍNEAS & INVERSIÓN
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-pink-300 transition-colors leading-snug">
                      Despliegue metropolitano Casco Viejo a 4to Anillo
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                      Convocatorias para líneas de micros, sindicatos y socios de transporte en Bolivia.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono text-pink-400 flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <span>Conectar</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>

            </div>

          </div>
        )}

        {/* Integration Status Footer Callout */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5BE]" />
            <span>Cuenta oficial verificada: @urbo.corp · Santa Cruz de la Sierra</span>
          </div>

          <span className="text-[11px] text-slate-500">
            {hasLivePosts 
              ? 'Sincronizado vía Meta Graph API · Caché 15 min' 
              : 'Integración autorizada lista · Requiere INSTAGRAM_ACCESS_TOKEN en servidor'}
          </span>
        </div>

      </div>
    </section>
  );
};

export default InstagramGallery;
