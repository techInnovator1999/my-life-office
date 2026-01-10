export function Businesses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-main dark:text-white">Businesses</h1>
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
            Manage business opportunities
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Opportunity</span>
          </span>
        </button>
      </div>
      <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
        <p className="text-gray-700 dark:text-gray-300">Businesses page coming soon...</p>
      </div>
    </div>
  )
}


