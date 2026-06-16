/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        night: {
          950: '#05070d',
          900: '#0a0d14',
          800: '#10141e',
          700: '#161b28',
          600: '#1d2433',
        },
        bronze: {
          400: '#e5b97a',
          500: '#d4a25d',
          600: '#b8854a',
          700: '#8c5e2e',
        },
        gold: {
          400: '#f4d289',
          500: '#e6b656',
          600: '#c89538',
        },
        neon: {
          pink: '#ff3ea5',
          cyan: '#37e6ff',
          violet: '#9d4dff',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 10px 40px -10px rgba(230, 182, 86, 0.45)',
        card: '0 30px 60px -25px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'radial-spot':
          'radial-gradient(circle at 20% 10%, rgba(230,182,86,0.18), transparent 55%), radial-gradient(circle at 80% 90%, rgba(157,77,255,0.12), transparent 50%)',
        'gold-line':
          'linear-gradient(90deg, transparent, rgba(230,182,86,0.6), transparent)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 24px rgba(230,182,86,0.35)' },
          '50%': { boxShadow: '0 0 40px rgba(230,182,86,0.65)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.5s linear infinite',
        floaty: 'floaty 5s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
