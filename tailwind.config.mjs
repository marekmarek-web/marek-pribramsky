/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#1D2354',
          cyan: '#4FC6F2',
          background: '#F8FAFC',
          white: '#FFFFFF',
          text: '#0F172A',
          muted: '#475569',
          border: '#E2E8F0',
        },
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
};
