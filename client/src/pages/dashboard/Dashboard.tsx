import { useAuth } from '@/store/authContext'

type StatCardProps = {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative'
  icon: string
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6 transition-colors hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark">{title}</h3>
        <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-text-main dark:text-white mb-1">{value}</p>
      {change && (
        <p
          className={`text-sm ${
            changeType === 'positive'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {change}
        </p>
      )}
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-main dark:text-white font-display">
          Dashboard
        </h1>
        <p className="text-text-muted dark:text-text-muted-dark mt-1">
          Welcome back, {user?.firstName}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value="1,234"
          change="+12.5% from last month"
          changeType="positive"
          icon="group"
        />
        <StatCard
          title="Active Opportunities"
          value="48"
          change="+3 new today"
          changeType="positive"
          icon="ads_click"
        />
        <StatCard
          title="Revenue (MTD)"
          value="$125,430"
          change="+8.2% from last month"
          changeType="positive"
          icon="payments"
        />
        <StatCard
          title="Conversion Rate"
          value="24.5%"
          change="-2.1% from last month"
          changeType="negative"
          icon="trending_up"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-card border border-neutral-200 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-main dark:text-white">Recent Activity</h2>
            <button className="text-sm text-primary hover:text-primary-hover font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {/* Activity Item */}
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-lg">person_add</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-main dark:text-white">
                  <span className="font-semibold">John Doe</span> added a new contact
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">
                  check_circle
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-main dark:text-white">
                  <span className="font-semibold">Opportunity #1234</span> moved to Closed Won
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">
                  edit
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-main dark:text-white">
                  <span className="font-semibold">Jane Smith</span> updated contact information
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-text-main dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-2xl text-primary">
                person_add
              </span>
              <span className="text-sm font-medium text-text-main dark:text-white">Add Contact</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-2xl text-primary">
                add_circle
              </span>
              <span className="text-sm font-medium text-text-main dark:text-white">
                New Opportunity
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-2xl text-primary">
                sync
              </span>
              <span className="text-sm font-medium text-text-main dark:text-white">Sync Contacts</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-2xl text-primary">
                analytics
              </span>
              <span className="text-sm font-medium text-text-main dark:text-white">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

