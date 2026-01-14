import { InputHTMLAttributes, forwardRef } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  icon?: string
  error?: string
  required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, required, className = '', type, ...props }, ref) => {
    // Hide browser spinner arrows for number inputs to avoid conflict with custom icons
    const isNumberInput = type === 'number'
    
    const inputClasses = [
      'w-full rounded-md border border-neutral-200 dark:border-slate-700',
      'bg-white dark:bg-surface-dark',
      isNumberInput ? 'pr-4' : icon ? 'pr-10' : 'px-4',
      icon ? 'pl-10' : 'px-4',
      'py-2.5 text-base font-normal',
      'text-neutral-900 dark:text-white',
      'placeholder:text-neutral-400 dark:placeholder:text-text-muted-dark',
      'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10',
      'transition-colors duration-200',
      // Hide browser spinner for number inputs
      isNumberInput && '[appearance:textfield] [-moz-appearance:textfield]',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Hide webkit spinner arrows for number inputs
    const spinnerHideStyles = isNumberInput ? {
      WebkitAppearance: 'none' as const,
      MozAppearance: 'textfield' as const,
    } : {}

    const iconClasses = [
      'absolute left-3 top-1/2 -translate-y-1/2',
      'text-neutral-400 group-focus-within:text-primary',
      'transition-colors pointer-events-none',
    ].join(' ')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          <input 
            ref={ref} 
            className={inputClasses} 
            type={type}
            style={spinnerHideStyles}
            {...props} 
          />
          {icon && (
            <span className={iconClasses}>
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </span>
          )}
          {/* Hide webkit spinner arrows */}
          {isNumberInput && (
            <style>{`
              input[type="number"]::-webkit-inner-spin-button,
              input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
            `}</style>
          )}
        </div>
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 mt-1 ml-1">
            {error}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

