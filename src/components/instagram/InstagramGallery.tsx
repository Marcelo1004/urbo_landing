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
  RefreshCw
} from 'lucide-react';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/motion/motionTokens';
import { InstagramPost } from '@/services/instagramTypes';
import { fetchInstagramFeed, FALLBACK_INSTAGRAM_POSTS } from '@/services/instagramClient';

gsap.registerPlugin(ScrollTrigger);

export const InstagramGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK_INSTAGRAM_POSTS);
  const [feedSource, setFeedSource] = useState<string>('cached_official_feed');
  const [lastUpdated, setLastUpdated] = useState<string>('Sincronizado');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live feed from secure backend endpoint /api/instagram/feed
  useEffect(() => {
    let isMounted = true;

    async function loadFeed() {
      setIsRefreshing(true);
      const res = await fetchInstagramFeed();
      if (isMounted) {
        if (res.posts && res.posts.length > 0) {
          setPosts(res.posts);
          setFeedSource(res.source);
          setLastUpdated(
            new Date(res.lastUpdated).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
          );
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
        '.instagram-post-card',
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
    }, sec);

    return () => ctx.revert();
  }, [posts]);

  // Featured first post + remaining grid
  const featuredPost = posts[0] || FALLBACK_INSTAGRAM_POSTS[0];
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
              <span>FEED OFICIAL · @URBO.CORP</span>
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
                <span>Actualizado: {lastUpdated}</span>
              </span>
              <span className="text-white/40">·</span>
              <span className="text-[#00E5BE]">Sincronización automática activa</span>
            </div>
          </div>

          {/* Follow button opening the official profile */}
          <a
            href="https://www.instagram.com/urbo.corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:shadow-[0_0_25px_rgba(253,29,29,0.35)] w-fit shrink-0"
          >
            <Instagram className="w-4 h-4 fill-current stroke-none" />
            <span>Seguir a @urbo.corp</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* Content Layout: 1 Featured Post + 3 Grid Posts */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Featured Post Card (Columns 1-5 on desktop) */}
          <div className="lg:col-span-5 flex">
            <a
              href={featuredPost.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-post-card group w-full flex flex-col justify-between rounded-3xl overflow-hidden bg-[#0B1426] border border-white/10 hover:border-pink-500/50 hover:shadow-[0_20px_45px_rgba(225,48,108,0.2)] transition-all duration-300"
            >
              {/* Media Thumbnail Container */}
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
                
                {/* Format Badge (Reel / Video) */}
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

              {/* Content Body */}
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

          {/* Grid of Remaining Posts (Columns 6-12 on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-post-card group flex flex-col justify-between rounded-3xl overflow-hidden bg-[#0B1426] border border-white/10 hover:border-pink-500/40 hover:shadow-[0_15px_35px_rgba(225,48,108,0.15)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
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

                  {/* Format tag */}
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

                {/* Content */}
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

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Ver post</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#00E5BE] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>

        {/* DM Footer Callout */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#0F1C35] via-[#0B1426] to-[#0F1C35] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">¿Quieres coordinar tu línea o participar en la siguiente fase?</h4>
              <p className="text-xs text-slate-300 font-sans">Escríbenos directamente por mensaje en Instagram o agenda una demo con los fundadores.</p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/urbo.corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold transition-all shrink-0 hover:scale-105"
          >
            Enviar DM a @urbo.corp
          </a>
        </div>

      </div>
    </section>
  );
};

export default InstagramGallery;
