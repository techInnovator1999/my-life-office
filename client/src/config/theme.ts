/**
 * Theme Configuration
 * 
 * This file contains theme constants and utilities to ensure
 * consistent theming across the application.
 * 
 * All components must use these values instead of hardcoded colors.
 */

export const theme = {
  colors: {
    // Primary Blue - Brand Color (from reference: #307fef)
    primary: {
      DEFAULT: '#307fef',  // Main primary color from reference
      hover: '#2563eb',     // Primary hover
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
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  borderRadius: {
    sm: '0.375rem',  // 6px
    DEFAULT: '0.5rem', // 8px - default from design files
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px (or 1rem in some files)
    xl: '1.5rem',    // 24px from design files
    '2xl': '2rem',   // 32px from design files
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    // Custom shadows from design files
    glow: '0 0 20px -5px rgba(127, 25, 230, 0.3)',
    'glow-hover': '0 0 30px -5px rgba(127, 25, 230, 0.5)',
    soft: '0 4px 20px -2px rgba(127, 25, 230, 0.1)',
    card: '0 2px 8px -1px rgba(0,0,0,0.05)',
  },
  transitions: {
    default: '200ms',
    slow: '300ms',
    easing: 'ease-in-out',
  },
} as const

/**
 * Common class name patterns for consistent styling
 * Use these as reference when building components
 */
export const commonClasses = {
  // Button patterns - Business CRM style
  buttonPrimary: 'px-4 py-2 bg-primary text-white rounded-md font-medium shadow-sm hover:bg-primary-hover active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200',
  
  buttonSecondary: 'px-3 py-1.5 bg-white dark:bg-surface-dark text-primary border border-neutral-200 dark:border-slate-700 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20',
  
  // Card pattern - Business CRM style
  card: 'bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-4 transition-colors hover:shadow-md hover:bg-neutral-50 dark:hover:bg-surface-dark-alt',
  
  cardGlass: 'bg-white/80 dark:bg-surface-dark/70 backdrop-blur-sm rounded-lg border border-neutral-200/50 dark:border-slate-700/50 p-4 transition-colors hover:bg-white/90 dark:hover:bg-surface-dark/80 hover:shadow-md',
  
  // Input pattern - Business CRM style
  input: 'w-full px-4 py-2.5 border border-neutral-200 dark:border-slate-700 rounded-md bg-white dark:bg-surface-dark text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors duration-200',
  
  // Container pattern
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Text patterns (from design files)
  textPrimary: 'text-neutral-900 dark:text-white',
  textSecondary: 'text-neutral-500 dark:text-text-muted-dark',
  textMuted: 'text-neutral-400 dark:text-text-muted-dark',
  
  // Hover effects - Business CRM style (no transforms)
  hoverScale: 'transition-colors duration-200',
  hoverLift: 'transition-colors duration-200 hover:shadow-md',
} as const

