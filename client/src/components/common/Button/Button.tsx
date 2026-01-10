/**
 * Button Component - Business CRM Style
 * 
 * Updated to reflect solid business CRM look with:
 * - No glow effects
 * - Smaller sizes
 * - Simple transitions
 * - Subtle shadows
 */

import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading, className = '', disabled, ...props }, ref) => {
    // Base classes - Business CRM style
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium',  // Medium font weight (not bold)
      'rounded-md',   // rounded-md for business look
      'transition-colors duration-200',  // Simple color transitions only
      'focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ]

    // Variant classes - Business CRM style (no glow, no transforms)
    const variantClasses: Record<ButtonVariant, string[]> = {
      primary: [
        'bg-primary text-white',
        'hover:bg-primary-hover active:bg-primary-800',
        'shadow-sm',  // Subtle shadow instead of glow
        'focus:ring-2 focus:ring-primary/20',
      ],
      secondary: [
        'bg-white dark:bg-surface-dark',
        'text-primary',
        'border border-neutral-200 dark:border-slate-700',
        'hover:bg-neutral-50 dark:hover:bg-slate-700',
        'focus:ring-2 focus:ring-primary/20',
      ],
      outline: [
        'bg-transparent',
        'text-primary',
        'border border-primary',
        'hover:bg-primary/10 dark:hover:bg-primary/20',
        'focus:ring-2 focus:ring-primary/20',
      ],
      ghost: [
        'bg-transparent',
        'text-neutral-700 dark:text-text-muted-dark',
        'hover:bg-neutral-100 dark:hover:bg-slate-700',
        'focus:ring-2 focus:ring-neutral-500',
      ],
    }

    // Size classes - Smaller, tighter spacing
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',  // Reduced from px-6 py-3.5
      lg: 'px-6 py-2.5 text-lg',  // Reduced from px-8 py-4
    }

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ')

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
