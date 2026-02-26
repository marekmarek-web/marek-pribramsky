/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.html',
    './assets/js/**/*.js',
    './partials/**/*.html'
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      spacing: {
        'section': 'clamp(3rem, 6vw, 7rem)',
        'section-sm': 'clamp(2.5rem, 5vw, 5rem)',
      },
      colors: {
        brand: {
          navy: '#1D2354',
          navyLight: '#2a3366',
          dark: '#0a0f29',
          cyan: '#4FC6F2',
          gold: '#fbbf24',
          background: '#F8FAFC',
          white: '#FFFFFF',
          text: '#0F172A',
          muted: '#475569',
          border: '#E2E8F0',
        }
      },
      maxWidth: { content: '1120px' },
      animation: { shimmer: 'shimmer 2.5s infinite' },
      keyframes: { shimmer: { '0%': { transform: 'translateX(-150%) skewX(-20deg)' }, '100%': { transform: 'translateX(150%) skewX(-20deg)' } } }
    },
  },
  plugins: [],
};
