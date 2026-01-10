import { useState } from 'react'

type FiltersPanelProps = {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
}

type FilterState = {
  accountType: string
  services: string
  interest: string
  daysOpen: number
  maxClosingDate: string
}

export function FiltersPanel({ isOpen, onClose, onApplyFilters }: FiltersPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    accountType: 'All',
    services: 'All',
    interest: 'All',
    daysOpen: 50,
    maxClosingDate: '',
  })

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
      accountType: 'All',
      services: 'All',
      interest: 'All',
      daysOpen: 50,
      maxClosingDate: '',
    }
    setFilters(resetFilters)
    onApplyFilters(resetFilters)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-surface-dark shadow-xl border-l border-neutral-200 dark:border-slate-700 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-text-main dark:text-white">Filters</h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close filters"
          >
            <span className="material-symbols-outlined text-[20px] text-text-muted dark:text-text-muted-dark">
              close
            </span>
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto auto-scrollbar p-4 space-y-6">
          {/* Account Type */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-white mb-3">
              Account Type
            </label>
            <div className="space-y-2">
              {['All', 'Individual', 'Business', 'Employees'].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={option}
                    checked={filters.accountType === option}
                    onChange={(e) => handleFilterChange('accountType', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-text-main dark:text-white">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-white mb-3">
              Services
            </label>
            <div className="space-y-2">
              {['All', 'Life Insurance', 'Annuity', 'Medicare'].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="services"
                    value={option}
                    checked={filters.services === option}
                    onChange={(e) => handleFilterChange('services', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-text-main dark:text-white">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interest */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-white mb-3">
              Interest
            </label>
            <div className="space-y-2">
              {['All', 'Cold', 'Warm', 'Hot'].map((option) => {
                const isSelected = filters.interest === option
                const colorClass =
                  option === 'Hot'
                    ? 'text-red-600 dark:text-red-400'
                    : option === 'Warm'
                      ? 'text-orange-600 dark:text-orange-400'
                      : option === 'Cold'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-text-main dark:text-white'
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${
                      isSelected
                        ? option === 'Hot'
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : option === 'Warm'
                            ? 'bg-orange-50 dark:bg-orange-900/20'
                            : option === 'Cold'
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'bg-neutral-100 dark:bg-slate-700'
                        : 'hover:bg-neutral-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interest"
                      value={option}
                      checked={isSelected}
                      onChange={(e) => handleFilterChange('interest', e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className={`text-sm font-medium ${colorClass}`}>{option}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Days Open */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-white mb-3">
              Days open
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="365"
                value={filters.daysOpen}
                onChange={(e) => handleFilterChange('daysOpen', parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted dark:text-text-muted-dark">
                  Number of days since opportunity opens
                </span>
                <span className="text-sm font-semibold text-primary">{filters.daysOpen}</span>
              </div>
            </div>
          </div>

          {/* Max Closing Date */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-white mb-3">
              Max closing date
            </label>
            <div className="relative">
              <input
                type="date"
                value={filters.maxClosingDate}
                onChange={(e) => handleFilterChange('maxClosingDate', e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-neutral-200 dark:border-slate-700 rounded-md bg-white dark:bg-surface-dark text-text-main dark:text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                placeholder="MM/DD/YYYY"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-text-muted-dark">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </span>
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">
              Tickets that are open from this date range
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-slate-700 flex items-center justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium shadow-sm hover:bg-primary-hover active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}

