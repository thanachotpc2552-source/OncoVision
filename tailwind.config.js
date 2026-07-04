/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand palette – trust-inspiring teal/blue
        primary: {
          50:  '#edfafa',
          100: '#d5f5f6',
          200: '#aeebed',
          300: '#79dce0',
          400: '#44c5cb',
          500: '#29a8b1',
          600: '#1f8a94',
          700: '#1e6f79',
          800: '#1d5863',
          900: '#1b4a54',
          950: '#0b3039',
        },
        // Accent: deep navy for headings and UI chrome
        navy: {
          50:  '#f0f4fa',
          100: '#dde6f4',
          200: '#c3d1ec',
          300: '#9ab3df',
          400: '#6b8ecf',
          500: '#4a6fc2',
          600: '#3857b6',
          700: '#3047a3',
          800: '#2c3d85',
          900: '#283568',
          950: '#1c2348',
        },
        // Neutral grays for backgrounds and text
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern':
          'linear-gradient(135deg, #0b3039 0%, #1e6f79 40%, #1e293b 100%)',
        'card-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glass-lg': '0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
        glow: '0 0 20px rgba(41, 168, 177, 0.4)',
        'glow-lg': '0 0 40px rgba(41, 168, 177, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
