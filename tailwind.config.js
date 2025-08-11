/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    screens: {
      'max-xs': {'max': '474px'},
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Custom color palette for both themes
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Dark theme specific colors
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#f1f5f9',
          'text-secondary': '#94a3b8',
        }
      },
      backgroundColor: {
        'theme-bg': 'var(--bg-color)',
        'theme-surface': 'var(--surface-color)',
        'theme-border': 'var(--border-color)',
      },
      textColor: {
        'theme-text': 'var(--text-color)',
        'theme-text-secondary': 'var(--text-secondary-color)',
      },
      borderColor: {
        'theme-border': 'var(--border-color)',
      }
    },
  },
  plugins: [],
}