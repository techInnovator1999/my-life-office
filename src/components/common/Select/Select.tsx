import { useState, useRef, useEffect } from 'react'

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  label?: string
  icon?: string
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
}

export function Select({
  label,
  icon,
  options,
  value,
  onChange,
  onBlur,
  error,
  required,
  placeholder = 'Select an option',
  searchable = false,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [hasBeenFocused, setHasBeenFocused] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
        // Only call onBlur if the field was actually interacted with
        if (onBlur && hasBeenFocused) {
          onBlur()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur, isOpen, hasBeenFocused])

  const filteredOptions = searchable && searchTerm
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const inputClasses = [
    'w-full rounded-md border border-neutral-200 dark:border-slate-700',
    disabled
      ? 'bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-text-muted-dark cursor-not-allowed'
      : 'bg-white dark:bg-surface-dark text-neutral-900 dark:text-white cursor-pointer',
    'px-4 py-2.5 text-base font-normal',
    'placeholder:text-neutral-400 dark:placeholder:text-text-muted-dark',
    disabled
      ? ''
      : 'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10',
    'transition-colors duration-200',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
  ]
    .filter(Boolean)
    .join(' ')

  // Custom icon positioned on the LEFT to avoid conflict with dropdown arrow
  const customIconClasses = [
    'absolute left-3 top-1/2 -translate-y-1/2',
    'text-neutral-400 group-focus-within:text-primary',
    'transition-colors pointer-events-none',
  ].join(' ')

  // Dropdown arrow always on the RIGHT
  const dropdownIconClasses = [
    'absolute right-3 top-1/2 -translate-y-1/2',
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
      <div className="relative group" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            if (!disabled) {
              setHasBeenFocused(true)
              setIsOpen(!isOpen)
            }
          }}
          disabled={disabled}
          className={inputClasses}
        >
          <div className={`flex items-center justify-between ${icon ? 'pl-9' : ''} pr-6`}>
            <span className={selectedOption ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-text-muted-dark'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
        </button>
        {icon && (
          <span className={customIconClasses}>
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          </span>
        )}
        <span className={dropdownIconClasses}>
          <span className="material-symbols-outlined text-[18px]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </span>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-neutral-200 dark:border-slate-700 z-50 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-neutral-200 dark:border-slate-700">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary/10"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="max-h-64 overflow-y-auto auto-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors text-left ${
                      option.value === value ? 'bg-primary/10 dark:bg-primary/20' : ''
                    }`}
                  >
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {option.label}
                    </span>
                    {option.value === value && (
                      <span className="material-symbols-outlined text-[20px] text-primary font-semibold">
                        check
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
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

