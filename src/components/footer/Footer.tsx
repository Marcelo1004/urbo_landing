import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { UrboLogo } from '@/components/ui/UrboLogo';

gsap.registerPlugin(MotionPathPlugin);

const ROUTE_D = 'M -20 238 C 140 238 200 210 330 214 S 520 236 640 206 S 860 190 980 222 S 1160 236 1220 214';

const NAV = [
  { label: 'Oportunidad', href: '#oportunidad' },
  { label: 'Solución', href: '#solucion' },
  { label: 'Piloto', href: '#piloto' },
  { label: 'Beneficiarios', href: '#audiencias' },
  { label: 'Instagram', href: '#instagram' },
  { label: 'Roadmap', href: '#roadmap' },
];

const Palm: React.FC<{ x: number; h: number }> = ({ x, h }) => (
  <g transform={`translate(${x} ${250 - h})`} fill="#0B1428" stroke="#0B1428">
    <path d={`M0 ${h} Q4 ${h / 2} 0 0`} strokeWidth="4" fill="none" />
    {[-70, -35, 0, 35, 70].map((a) => (
      <path key={a} d="M0 0 Q18 -10 34 6 Q18 -2 0 2Z" transform={`rotate(${a - 90 + 90})`} />
    ))}
  </g>
);

export const Footer: React.FC = () => {
  const microRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const micro = microRef.current;
    if (!micro) return;
    let tween: gsap.core.Tween | null = null;
    const start = () => {
      tween = gsap.to(micro, {
        duration: 22,
        ease: 'none',
        repeat: -1,
        motionPath: { path: '#footer-route', align: '#footer-route', alignOrigin: [0.5, 0.5], autoRotate: true },
      });
    };
    if (reduce) {
      gsap.set(micro, { motionPath: { path: '#footer-route', align: '#footer-route', alignOrigin: [0.5, 0.5], start: 0.4, end: 0.4 } });
    } else {
      start();
    }
    const svg = svgRef.current;
    const io = new IntersectionObserver(([e]) => {
      if (!tween) return;
      e.isIntersecting ? tween.play() : tween.pause();
    });
    if (svg) io.observe(svg);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, []);

  return (
    <footer className="relative overflow-hidden bg-[#050A18] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6 relative z-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] items-start">
          <div>
            <div className="flex items-center gap-3">
              <UrboLogo size={52} />
              <span className="font-tech text-3xl font-black text-white tracking-wider">URBO</span>
            </div>
            <p className="mt-4 text-xl sm:text-2xl font-semibold text-white">Tu micro en tiempo real.</p>
            <p className="mt-2 text-sm text-slate-400 max-w-sm">
              Movilidad urbana pensada para Santa Cruz de la Sierra.
            </p>
            <a
              href="#contacto"
              className="mt-6 inline-flex items-center rounded-full bg-urbo-teal2 px-6 py-2.5 text-sm font-bold text-[#050A18] hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Contáctanos
            </a>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">Navegación</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-urbo-teal2 transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">Síguenos</h3>
            <a
              href="https://www.instagram.com/urbo.corp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-200 hover:text-urbo-teal2 transition-colors"
            >
              @urbo.corp en Instagram
            </a>
            <p className="mt-4 text-sm text-slate-400">Santa Cruz de la Sierra, Bolivia</p>
          </div>
        </div>
      </div>

      {/* Santa Cruz en movimiento */}
      <svg
        ref={svgRef}
        viewBox="0 40 1200 230"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-auto block -mb-px"
        role="img"
        aria-label="Silueta de Santa Cruz con la Catedral, palmeras y un micro recorriendo la ruta"
      >
        <defs>
          <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#050A18" stopOpacity="0" />
            <stop offset="0.6" stopColor="#3B1F4A" stopOpacity="0.45" />
            <stop offset="1" stopColor="#F59E0B" stopOpacity="0.35" />
          </linearGradient>
          <filter id="fglow"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <rect width="1200" height="270" fill="url(#fsky)" />
        {/* skyline */}
        <g fill="#0B1428">
          <rect x="30" y="170" width="60" height="80" /><rect x="100" y="150" width="46" height="100" />
          <rect x="160" y="185" width="70" height="65" /><rect x="260" y="160" width="50" height="90" />
          <rect x="860" y="165" width="56" height="85" /><rect x="930" y="140" width="48" height="110" />
          <rect x="995" y="180" width="80" height="70" /><rect x="1090" y="155" width="52" height="95" />
          {/* Catedral */}
          <rect x="430" y="170" width="250" height="80" />
          <rect x="440" y="100" width="46" height="150" /><rect x="624" y="100" width="46" height="150" />
          <path d="M440 100 L463 66 L486 100Z" /><path d="M624 100 L647 66 L670 100Z" />
          <path d="M490 170 L555 128 L620 170Z" />
          <rect x="545" y="60" width="4" height="0" />
        </g>
        <g fill="#F59E0B" opacity="0.85">
          <rect x="452" y="116" width="6" height="12" /><rect x="636" y="116" width="6" height="12" />
          <rect x="535" y="190" width="40" height="60" opacity="0.5" />
        </g>
        <Palm x={350} h={90} /><Palm x={395} h={70} /><Palm x={720} h={95} /><Palm x={770} h={72} /><Palm x={1170} h={80} />
        <rect y="244" width="1200" height="26" fill="#070D1F" />
        {/* route */}
        <path d={ROUTE_D} fill="none" stroke="#38BDF8" strokeWidth="6" opacity="0.5" filter="url(#fglow)" />
        <path id="footer-route" d={ROUTE_D} fill="none" stroke="#7DD3FC" strokeWidth="2.5" strokeLinecap="round" />
        <g ref={microRef}>
          <rect x="-16" y="-8" width="32" height="14" rx="4" fill="#00E5BE" />
          <rect x="-12" y="-5" width="7" height="5" rx="1" fill="#050A18" />
          <rect x="-3" y="-5" width="7" height="5" rx="1" fill="#050A18" />
          <rect x="6" y="-5" width="6" height="5" rx="1" fill="#050A18" />
          <circle cx="-8" cy="6" r="3" fill="#050A18" /><circle cx="8" cy="6" r="3" fill="#050A18" />
        </g>
      </svg>

      <div className="relative z-10 bg-[#050A18] border-t border-white/5 py-4 text-center text-xs font-mono text-slate-500">
        © 2026 URBO · Santa Cruz de la Sierra, Bolivia
      </div>
    </footer>
  );
};

