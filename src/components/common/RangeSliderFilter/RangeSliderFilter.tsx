import { useState, useRef, useEffect } from 'react'

type RangeSliderFilterProps = {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  description?: string
}

export function RangeSliderFilter({
  label,
  value,
  onChange,
  min = 0,
  max = 365,
  description,
}: RangeSliderFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayLabel = `${label} (${value})`

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-surface-dark border border-neutral-200 dark:border-slate-700 rounded-md text-xs font-medium text-text-main dark:text-white hover:bg-neutral-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      >
        <span>{displayLabel}</span>
        <span className="material-symbols-outlined text-[16px] text-text-muted dark:text-text-muted-dark">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Custom tooltip showing filter name on hover */}
      {!isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[60]">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-neutral-200 dark:border-slate-700 z-50 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-main dark:text-white">{label}</label>
              <span className="text-sm font-semibold text-primary">{value}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            {description && (
              <p className="text-xs text-text-muted dark:text-text-muted-dark">{description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

