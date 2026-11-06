/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        urbo: {
          navy: '#0B1426',
          navy2: '#0F1C35',
          navy3: '#162040',
          navy4: '#1E2D52',
          teal: '#00C9A7',
          teal2: '#00E5BE',
          teal3: '#009E85',
          amber: '#F4C430',
          offwhite: '#E8EFF8',
          mist: '#94A3C0',
        },
        radioactive: {
          DEFAULT: '#A6FF00',
          bright: '#B8FF21',
          deep: '#7CFF00',
          dim: 'rgba(166, 255, 0, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Grotesk', 'JetBrains Mono', 'monospace'],
        tech: ['"SD Dystopian"', 'Syne', 'Space Grotesk', 'Outfit', 'sans-serif'],
        dystopian: ['"SD Dystopian"', 'Syne', 'sans-serif'],
        display: ['"SD Dystopian"', 'Syne', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 0 50px -10px rgba(0, 201, 167, 0.35)',
        'glow-amber': '0 0 40px -10px rgba(244, 196, 48, 0.3)',
        'glow-radioactive': '0 0 45px -5px rgba(166, 255, 0, 0.5)',
        'glass-edge': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), 0 20px 40px -15px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
