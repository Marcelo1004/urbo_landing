import React from 'react';
import { UrboLogo } from '@/components/ui/UrboLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative py-12 border-t border-white/10 overflow-hidden bg-[#070B14]/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <UrboLogo size={42} />
            <div>
              <div className="font-tech text-lg font-black text-white tracking-wider">URBO</div>
              <div className="text-xs text-slate-400 font-mono">Tu micro en tiempo real.</div>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
            <li>
              <a href="#oportunidad" className="hover:text-urbo-teal2 transition-colors">Oportunidad</a>
            </li>
            <li>
              <a href="#solucion" className="hover:text-urbo-teal2 transition-colors">Solución</a>
            </li>
            <li>
              <a href="#piloto" className="hover:text-urbo-teal2 transition-colors">Piloto</a>
            </li>
            <li>
              <a href="#audiencias" className="hover:text-urbo-teal2 transition-colors">Beneficiarios</a>
            </li>
            <li>
              <a href="#roadmap" className="hover:text-urbo-teal2 transition-colors">Roadmap</a>
            </li>
            <li>
              <a href="#contacto" className="hover:text-urbo-teal2 transition-colors">Contacto</a>
            </li>
          </ul>

          {/* Legal / Location */}
          <div className="text-xs font-mono text-slate-400 text-center md:text-right">
            © 2026 URBO · Santa Cruz de la Sierra, Bolivia
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <span>Infraestructura digital de movilidad urbana para Santa Cruz de la Sierra.</span>
          <span className="text-urbo-teal2 font-bold tracking-wider">URBO · DARK LIQUID GLASS & REAL MOBILITY</span>
        </div>
      </div>
    </footer>
  );
};
