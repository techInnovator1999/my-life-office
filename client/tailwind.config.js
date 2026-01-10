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
        // Primary Blue - Brand Color (from reference: #307fef)
        primary: {
          DEFAULT: '#307fef',  // Main primary color from reference
          hover: '#2563eb',     // Primary hover (blue-600)
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#307fef',  // Main primary color
          700: '#2563eb',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Background colors - Blue-tinted dark theme
        background: {
          light: '#f7f6f8',
          dark: '#0f172a',  // slate-900 - dark blue-gray background
        },
        // Surface colors for dark theme - Blue-tinted
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e293b',  // slate-800 - blue-gray surface
          darker: '#0f172a',  // slate-900 - darker for sidebars
          'dark-alt': '#1e293b',  // slate-800 - alternate surface
        },
        // Text colors - Updated for blue theme
        text: {
          main: '#141118',
          muted: '#64748b',  // slate-500 - neutral gray
          'muted-dark': '#94a3b8',  // slate-400 - lighter blue-gray for dark theme
        },
        // Gray scale for text, borders, backgrounds
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Slate for dark theme backgrounds
        slate: {
          50: '#f8fafc',
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
        // Semantic colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        info: {
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
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],  // Inter for headings
        body: ['Inter', 'sans-serif'],     // Inter for body text
        sans: ['Inter', 'system-ui', 'sans-serif'],  // Inter as default sans-serif
      },
      borderRadius: {
        'sm': '0.375rem',   // 6px
        'DEFAULT': '0.5rem', // 8px - default from design files
        'md': '0.5rem',      // 8px
        'lg': '0.75rem',     // 12px (or 1rem in some files)
        'xl': '1.5rem',      // 24px from design files
        '2xl': '2rem',       // 32px from design files
        'full': '9999px',    // Full rounded
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        // Business CRM style - use shadow-sm and shadow-md only
        // Deprecated shadows (kept for backward compatibility, but should not be used):
        'glow': '0 0 20px -5px rgba(48, 127, 239, 0.3)',  // DEPRECATED - Use shadow-sm instead
        'glow-hover': '0 0 30px -5px rgba(48, 127, 239, 0.5)',  // DEPRECATED - Use shadow-md instead
        'soft': '0 4px 20px -2px rgba(48, 127, 239, 0.1)',  // DEPRECATED - Use shadow-sm instead
        'card': '0 2px 8px -1px rgba(0,0,0,0.05)',  // DEPRECATED - Use shadow-sm instead
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'in-out': 'ease-in-out',
      },
    },
  },
  plugins: [],
}

