/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'gor-bg': 'var(--gor-bg)',
        'gor-acento': 'var(--gor-acento)',
        'gor-txt': 'var(--gor-txt)',
        'gor-muted': 'var(--gor-muted)',
        'gor-border': 'var(--gor-border)',
        'gor-footer': 'var(--gor-footer-bg)',
        'gor-surface': 'var(--gor-surface)',
        'gor-surface2': 'var(--gor-surface2)',
        'gor-btn-txt': 'var(--gor-btn-txt)',
        'tiendzi-bg': '#0F1014',
        'tiendzi-accent': '#FF4B26',
        'tiendzi-card': '#1C1D24',
        'tiendzi-text': '#FFFFFF',
        'tiendzi-muted': '#8E95A3',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
