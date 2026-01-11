import { useState, useEffect } from 'react'
import { KanbanBoard } from '@/components/features/pipeline/KanbanBoard/KanbanBoard'
import { getOpportunities } from '@/services/opportunityService'
import { Opportunity, PipelineStage } from '@/types/opportunity'
import { FilterDropdown } from '@/components/common/FilterDropdown'
import { DateRangeFilter } from '@/components/common/DateRangeFilter'
import { RangeSliderFilter } from '@/components/common/RangeSliderFilter'

export function Pipeline() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [accountType, setAccountType] = useState<string[]>(['All'])
  const [accountTypeMode, setAccountTypeMode] = useState<'one' | 'many'>('one')
  const [services, setServices] = useState<string[]>(['All'])
  const [servicesMode, setServicesMode] = useState<'one' | 'many'>('one')
  const [interest, setInterest] = useState<string[]>(['All'])
  const [interestMode, setInterestMode] = useState<'one' | 'many'>('one')
  const [daysOpen, setDaysOpen] = useState<number>(50)
  const [maxClosingDate, setMaxClosingDate] = useState<string>('')

  useEffect(() => {
    loadOpportunities()
  }, [])

  const loadOpportunities = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getOpportunities()
      setOpportunities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load opportunities')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpportunityMove = async (opportunityId: string, newStage: PipelineStage) => {
    // Optimistically update the opportunity in the list
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === opportunityId ? { ...opp, pipelineStage: newStage } : opp))
    )
  }

  const handleOpportunityClick = (opportunity: Opportunity) => {
    // TODO: Open opportunity drawer/modal
    console.log('Clicked opportunity:', opportunity)
  }

  return (
    <div className="space-y-3">
      {/* Page Header - Responsive */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-text-main dark:text-white">
            Opportunities Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-0.5">
            Manage your sales opportunities
          </p>
        </div>

        {/* Action Buttons - Right of heading on desktop/tablet, below on mobile */}
        <div className="flex items-stretch gap-2 w-full md:w-auto md:flex-shrink-0">
          <button className="flex-1 md:flex-none md:px-4 px-4 py-2 h-10 bg-primary text-white rounded-md text-sm font-medium shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center justify-center">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Contact</span>
            </span>
          </button>
          <button className="flex-1 md:flex-none md:px-4 px-4 py-2 h-10 bg-primary text-white rounded-md text-sm font-medium shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center justify-center">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>New Opportunity</span>
            </span>
          </button>
        </div>
      </div>

      {/* Filter Area - Compact */}
      <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Icon - Non-interactive label */}
          <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 pointer-events-none">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </div>

          {/* Account Type Filter */}
          <FilterDropdown
            label="Account Type"
            options={[
              { value: 'All', label: 'All' },
              { value: 'Individual', label: 'Individual' },
              { value: 'Business', label: 'Business' },
              { value: 'Employees', label: 'Employees' },
            ]}
            selectedValues={accountType}
            onSelectionChange={setAccountType}
            selectMode={accountTypeMode}
            onSelectModeChange={setAccountTypeMode}
          />

          {/* Services Filter */}
          <FilterDropdown
            label="Services"
            options={[
              { value: 'All', label: 'All' },
              { value: 'Life Insurance', label: 'Life Insurance' },
              { value: 'Annuity', label: 'Annuity' },
              { value: 'Medicare', label: 'Medicare' },
            ]}
            selectedValues={services}
            onSelectionChange={setServices}
            selectMode={servicesMode}
            onSelectModeChange={setServicesMode}
          />

          {/* Interest Filter */}
          <FilterDropdown
            label="Interest"
            options={[
              { value: 'All', label: 'All' },
              { value: 'Cold', label: 'Cold' },
              { value: 'Warm', label: 'Warm' },
              { value: 'Hot', label: 'Hot' },
            ]}
            selectedValues={interest}
            onSelectionChange={setInterest}
            selectMode={interestMode}
            onSelectModeChange={setInterestMode}
          />

          {/* Days Open Filter */}
          <RangeSliderFilter
            label="Days Open"
            value={daysOpen}
            onChange={setDaysOpen}
            min={0}
            max={365}
            description="Number of days since opportunity opens"
          />

          {/* Max Closing Date Filter */}
          <DateRangeFilter
            label="Max Closing Date"
            value={maxClosingDate}
            onChange={setMaxClosingDate}
            placeholder="MM/DD/YYYY"
          />
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96 bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">
              error
            </span>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">Error loading opportunities</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
            <button
              onClick={loadOpportunities}
              className="ml-auto px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
          <KanbanBoard
            opportunities={opportunities}
            onOpportunityClick={handleOpportunityClick}
            onOpportunityMove={handleOpportunityMove}
          />
        </div>
      )}
    </div>
  )
}

