/**
 * Theme Utilities
 * 
 * Helper functions for theme management
 */

export type Theme = 'light' | 'dark'

/**
 * Get current theme from localStorage or system preference
 */
export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored) return stored
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  
  localStorage.setItem('theme', theme)
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): Theme {
  const current = getInitialTheme()
  const newTheme: Theme = current === 'light' ? 'dark' : 'light'
  applyTheme(newTheme)
  return newTheme
}

/**
 * Set theme explicitly
 */
export function setTheme(theme: Theme): void {
  applyTheme(theme)
}


