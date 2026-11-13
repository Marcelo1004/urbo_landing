import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { UrboLogo } from '@/components/ui/UrboLogo';
import { useIntroSequence } from '@/motion/useIntroSequence';
import { motion } from '@/motion/motionTokens';

export const Navbar: React.FC = () => {
  const { phase } = useIntroSequence();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const hasNavAnimated = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse-follow light highlight on navbar
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    navRef.current.style.setProperty('--mouse-x', `${x}px`);
    navRef.current.style.setProperty('--mouse-y', `${y}px`);
    navRef.current.style.setProperty('--mouse-opacity', '1');
  };

  const handleMouseLeave = () => {
    if (!navRef.current) return;
    navRef.current.style.setProperty('--mouse-opacity', '0');
  };

  // Synchronized Entrance Animation tied to Intro Sequence
  useEffect(() => {
    if (!navRef.current) return;

    if (phase === 'loading' || phase === 'ready' || phase === 'exiting') {
      if (!hasNavAnimated.current) {
        gsap.set(navRef.current, { y: -20, opacity: 0 });
        if (logoRef.current) gsap.set(logoRef.current, { scale: 0.95, opacity: 0 });
      }
      return;
    }

    if ((phase === 'heroEntering' || phase === 'complete') && !hasNavAnimated.current) {
      hasNavAnimated.current = true;
      const tl = gsap.timeline({ defaults: { ease: motion.ease.enter } });
      tl.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: motion.duration.normal, ease: motion.ease.enter }
      ).fromTo(
        logoRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: motion.duration.fast, ease: motion.ease.enter },
        '-=0.35'
      );
    }
  }, [phase]);

  const navLinks = [
    { label: 'Oportunidad', href: '#oportunidad' },
    { label: 'Solución', href: '#solucion' },
    { label: 'Piloto', href: '#piloto' },
    { label: 'Beneficiarios', href: '#audiencias' },
    { label: 'Roadmap', href: '#roadmap' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-3 sm:top-5 inset-x-0 mx-auto z-50 px-4 transition-all duration-300 max-w-5xl">
        <nav
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-label="Navegación principal"
          className={cn(
            'liquid-glass-nav glass-glow-mouse rounded-full flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300',
            isScrolled ? 'shadow-2xl border-urbo-teal/25' : 'border-white/12'
          )}
        >
          {/* Brand Logo (Enlarged ~40% with subtle floating and micro-interaction) */}
          <a
            ref={logoRef}
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urbo-teal rounded-full py-0.5 pr-2 flex-shrink-0"
            aria-label="URBO - Tu micro en tiempo real"
          >
            {/* Logo Mark: 42px */}
            <UrboLogo size={42} className="transition-transform duration-300 group-hover:scale-105" />
            
            <div className="flex flex-col">
              <span className="font-tech text-lg sm:text-xl font-extrabold tracking-wider text-white leading-none group-hover:text-urbo-teal2 transition-colors">
                URBO
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 leading-tight mt-0.5">
                Santa Cruz · SCZ
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-white py-1 transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-urbo-teal2 group-hover:w-full transition-all duration-200 rounded-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Primary Action Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#contacto"
              className="apple-pill-primary px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Unirse</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-2xl md:hidden pt-28 px-6 flex flex-col justify-between pb-10 animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Navegación URBO
              </span>
              <span className="text-[10px] font-mono text-urbo-teal2 px-2.5 py-0.5 rounded-full bg-urbo-teal/15 border border-urbo-teal/30">
                Santa Cruz de la Sierra
              </span>
            </div>

            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="block text-2xl font-bold text-white hover:text-urbo-teal2 py-2 transition-colors font-tech"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-slate-400 font-mono">
              Santa Cruz de la Sierra · Bolivia
            </p>
            <a
              href="#contacto"
              onClick={handleLinkClick}
              className="apple-pill-primary w-full py-3.5 text-center text-sm flex items-center justify-center gap-2"
            >
              <span>Unirse al proyecto</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
