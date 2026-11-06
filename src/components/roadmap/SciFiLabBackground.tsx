import React from 'react';

export const SciFiLabBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-25 transition-opacity duration-700 select-none"
    >
      {/* Ambient gradient haze */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-radioactive/15 blur-[160px]" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[500px] rounded-full bg-urbo-teal/15 blur-[150px]" />

      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="rackGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C9A7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0B1426" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A6FF00" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#00E5BE" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#A6FF00" stopOpacity="0.25" />
          </linearGradient>
          <pattern id="serverGrid" width="40" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="19" x2="40" y2="19" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="6" cy="10" r="1.5" fill="#00E5BE" opacity="0.6" />
            <circle cx="14" cy="10" r="1.5" fill="#A6FF00" opacity="0.5" />
          </pattern>
        </defs>

        {/* =================================================================
            LEFT SIDE: SERVER RACKS & TELEMETRY CABINETS
            ================================================================= */}
        <g opacity="0.65">
          {/* Server Rack 1 */}
          <rect x="40" y="80" width="100" height="640" rx="4" fill="#070B14" stroke="rgba(0,201,167,0.3)" strokeWidth="1.5" />
          <rect x="45" y="90" width="90" height="620" fill="url(#serverGrid)" />
          
          {/* Server Rack 2 */}
          <rect x="160" y="120" width="90" height="600" rx="4" fill="#070B14" stroke="rgba(166,255,0,0.25)" strokeWidth="1.5" />
          <rect x="165" y="130" width="80" height="580" fill="url(#serverGrid)" />

          {/* Activity Status LED Strips (Blinking animation) */}
          <g className="animate-pulse">
            <circle cx="60" cy="110" r="2.5" fill="#A6FF00" />
            <circle cx="75" cy="110" r="2.5" fill="#00E5BE" />
            <circle cx="60" cy="170" r="2.5" fill="#00E5BE" />
            <circle cx="75" cy="170" r="2.5" fill="#A6FF00" />
            <circle cx="60" cy="230" r="2.5" fill="#A6FF00" />
            <circle cx="60" cy="350" r="2.5" fill="#00E5BE" />
            <circle cx="180" cy="150" r="2.5" fill="#00E5BE" />
            <circle cx="195" cy="150" r="2.5" fill="#A6FF00" />
            <circle cx="180" cy="210" r="2.5" fill="#A6FF00" />
          </g>
        </g>

        {/* =================================================================
            OVERHEAD CONDUITS & INDUSTRIAL CABLE BUNDLES
            ================================================================= */}
        <g opacity="0.45" strokeWidth="2">
          {/* Main Horizontal Transport Pipe */}
          <path d="M 0,60 L 500,60 Q 560,60 560,120 L 560,400 Q 560,450 620,450 L 1440,450" fill="none" stroke="url(#pipeGrad)" strokeDasharray="8 6" />
          
          {/* Secondary Telemetry Cable */}
          <path d="M 0,90 L 320,90 Q 360,90 360,130 L 360,700" fill="none" stroke="rgba(0,201,167,0.3)" />

          {/* Test Tube Feeder Conduit */}
          <path d="M 360,160 Q 420,160 420,220 L 420,400" fill="none" stroke="rgba(166,255,0,0.35)" strokeWidth="3" />
        </g>

        {/* =================================================================
            RIGHT SIDE: VINTAGE CRT MONITOR & OSCILLOSCOPE GRIDS
            ================================================================= */}
        <g opacity="0.5">
          {/* CRT Monitor Outer Bezel */}
          <rect x="1260" y="160" width="140" height="180" rx="12" fill="#08101E" stroke="rgba(0,201,167,0.4)" strokeWidth="2" />
          <rect x="1272" y="172" width="116" height="140" rx="6" fill="#030811" />
          
          {/* Oscilloscope Grid Lines inside CRT */}
          <line x1="1272" y1="242" x2="1388" y2="242" stroke="rgba(0,201,167,0.2)" strokeDasharray="2 2" />
          <line x1="1330" y1="172" x2="1330" y2="312" stroke="rgba(0,201,167,0.2)" strokeDasharray="2 2" />

          {/* Animated CRT Waveform Sine Wave */}
          <path
            d="M 1275,242 Q 1290,210 1305,242 T 1335,242 T 1365,242 T 1385,242"
            fill="none"
            stroke="#A6FF00"
            strokeWidth="1.8"
            className="animate-pulse"
          />

          {/* Subordinate Diagnostics Panel */}
          <rect x="1260" y="370" width="140" height="260" rx="8" fill="#070B14" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="1280" y1="400" x2="1380" y2="400" stroke="rgba(166,255,0,0.4)" strokeWidth="1" />
          <line x1="1280" y1="420" x2="1360" y2="420" stroke="rgba(0,201,167,0.4)" strokeWidth="1" />
          <line x1="1280" y1="440" x2="1370" y2="440" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </g>

        {/* Ambient floating dust light motes */}
        <g opacity="0.35">
          <circle cx="280" cy="220" r="1.5" fill="#A6FF00" />
          <circle cx="680" cy="180" r="2" fill="#00E5BE" />
          <circle cx="920" cy="320" r="1.5" fill="#FFFFFF" />
          <circle cx="540" cy="540" r="2" fill="#A6FF00" />
          <circle cx="1120" cy="460" r="1.5" fill="#00C9A7" />
        </g>
      </svg>
    </div>
  );
};

