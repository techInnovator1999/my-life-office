import { useState, useRef, useEffect } from 'react'

type FilterOption = {
  value: string
  label: string
}

type FilterDropdownProps = {
  label: string
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  selectMode?: 'one' | 'many'
  onSelectModeChange?: (mode: 'one' | 'many') => void
}

export function FilterDropdown({
  label,
  options,
  selectedValues,
  onSelectionChange,
  selectMode = 'one',
  onSelectModeChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalSelectMode, setInternalSelectMode] = useState<'one' | 'many'>(selectMode)
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

  const handleModeChange = (mode: 'one' | 'many') => {
    setInternalSelectMode(mode)
    if (onSelectModeChange) {
      onSelectModeChange(mode)
    }
    // If switching to "one" mode and multiple are selected, keep only the first
    if (mode === 'one' && selectedValues.length > 1) {
      onSelectionChange([selectedValues[0]])
    }
  }

  const handleOptionToggle = (value: string) => {
    if (internalSelectMode === 'one') {
      // Single select: replace selection
      onSelectionChange([value])
      setIsOpen(false)
    } else {
      // Multi select: toggle selection
      if (selectedValues.includes(value)) {
        onSelectionChange(selectedValues.filter((v) => v !== value))
      } else {
        onSelectionChange([...selectedValues, value])
      }
    }
  }

  const displayLabel =
    selectedValues.length === 0
      ? label
      : selectedValues.length === 1
        ? options.find((opt) => opt.value === selectedValues[0])?.label || label
        : `${selectedValues.length} selected`

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-surface-dark border border-neutral-200 dark:border-slate-700 rounded-md text-xs font-medium text-text-main dark:text-white hover:bg-neutral-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      >
        <span>{displayLabel}</span>
        <span className="material-symbols-outlined text-[16px] text-gray-600 dark:text-gray-400">
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
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-neutral-200 dark:border-slate-700 z-50 overflow-hidden">
          {/* Select Mode Toggle - Always show */}
          <div className="p-3 border-b border-neutral-200 dark:border-slate-700 flex items-center gap-4 bg-neutral-50 dark:bg-slate-800/50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`${label}-mode`}
                checked={internalSelectMode === 'one'}
                onChange={() => handleModeChange('one')}
                className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-sm font-medium text-text-main dark:text-white">Select One</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`${label}-mode`}
                checked={internalSelectMode === 'many'}
                onChange={() => handleModeChange('many')}
                className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-sm font-medium text-text-main dark:text-white">Select Many</span>
            </label>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto auto-scrollbar">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionToggle(option.value)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-neutral-100 dark:border-slate-800 last:border-b-0"
                >
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{option.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[20px] text-primary font-semibold">
                      check
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

