import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface UrboLogoProps {
  className?: string;
  size?: number | string;
}

export const UrboLogo: React.FC<UrboLogoProps> = ({ className, size = 40 }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(
        'relative rounded-2xl bg-slate-900 border border-urbo-teal/30 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,201,167,0.25)] select-none flex-shrink-0',
        className
      )}
      style={{ width: size, height: size }}
    >
      {!imgError ? (
        <picture className="w-full h-full flex items-center justify-center p-1">
          <source srcSet="/urbo-logo.svg" type="image/svg+xml" />
          <source srcSet="/urbo-logo.png" type="image/png" />
          <img
            src="/urbo-logo.png"
            alt="URBO"
            className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            onError={() => setImgError(true)}
            loading="eager"
          />
        </picture>
      ) : (
        /* Built-in high-fidelity inline SVG fallback guaranteeing 0% broken logo */
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 22 26 V 65 C 22 80, 78 80, 78 65 V 26"
            stroke="#00E5BE"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect x="36" y="34" width="28" height="32" rx="6" fill="#0B1426" stroke="#00C9A7" strokeWidth="2.5" />
          <rect x="40" y="38" width="20" height="10" rx="2" fill="#00E5BE" />
          <circle cx="43" cy="58" r="2" fill="#FFFFFF" />
          <circle cx="57" cy="58" r="2" fill="#FFFFFF" />
          <circle cx="50" cy="24" r="2.5" fill="#A6FF00" />
        </svg>
      )}
    </div>
  );
};
