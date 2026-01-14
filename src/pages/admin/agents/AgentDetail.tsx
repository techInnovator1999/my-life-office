import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCrmAgents } from '@/services/agentService'
import { formatFullName, toTitleCase } from '@/utils/formatters'

type Agent = {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile?: string | null
  primaryLicenseType?: string | null
  registrationType?: string | null
  residentState?: string | null
  licenseNumber?: string | null
  yearsLicensed?: number | null
  priorProductsSold?: string | null
  currentCompany?: string | null
  isApproved: boolean
  status?: {
    id: string
    name: string
  }
  createdAt: string
}

type TabType = 'personal-info' | 'my-codes' | 'licensing' | 'education' | 'my-team' | 'banking-info'

export function AgentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('personal-info')

  useEffect(() => {
    if (id) {
      fetchAgent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchAgent = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Fetch all agents and find the one with matching ID
      const response = await getCrmAgents(1, 1000)
      const foundAgent = response.data.find((a) => a.id === id)
      if (foundAgent) {
        setAgent(foundAgent)
      } else {
        setError('Agent not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agent')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'personal-info', label: 'Personal Info' },
    { id: 'my-codes', label: 'My Codes' },
    { id: 'licensing', label: 'Licensing' },
    { id: 'education', label: 'Education' },
    { id: 'my-team', label: 'My Team' },
    { id: 'banking-info', label: 'Banking Info' },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="p-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted dark:text-text-muted-dark mt-2">Loading agent details...</p>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error || 'Agent not found'}</p>
        </div>
        <button
          onClick={() => navigate('/admin/agents/pending')}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-surface-dark border border-neutral-200 dark:border-slate-700 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
        >
          Back to Pending Agents
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-main dark:text-white font-display">
          Agent Details
        </h1>
        <button
          onClick={() => navigate('/admin/agents/pending')}
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Go Back
        </button>
      </div>

      {/* Agent Summary Card */}
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-neutral-200 dark:border-slate-700 p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="size-20 rounded-full bg-neutral-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-semibold text-text-muted dark:text-text-muted-dark">
              {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
            </span>
          </div>

          {/* Agent Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-text-main dark:text-white">
                {formatFullName(agent.firstName, agent.lastName)}
              </h2>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                {agent.isApproved ? 'Approved' : 'Pending'}
              </span>
            </div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark mb-4">
              {agent.email}
            </p>
            {agent.currentCompany && (
              <p className="text-sm text-primary hover:underline cursor-pointer">
                {agent.currentCompany}
              </p>
            )}
          </div>

          {/* Agent Details Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Agent Id</p>
              <p className="text-sm font-semibold text-text-main dark:text-white">
                {agent.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Life</p>
              <p className="text-sm font-semibold text-text-main dark:text-white">
                {agent.primaryLicenseType ? 'Active' : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Level</p>
              <p className="text-sm font-semibold text-text-main dark:text-white">
                {agent.yearsLicensed ? `${agent.yearsLicensed}%` : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Team</p>
              <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
            </div>
            <div>
              <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">NPN</p>
              <p className="text-sm font-semibold text-text-main dark:text-white">
                {agent.licenseNumber || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Plan</p>
              <p className="text-sm font-semibold text-text-main dark:text-white">
                {agent.registrationType || 'Free'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-neutral-200 dark:border-slate-700">
        {/* Tab Navigation */}
        <div className="border-b border-neutral-200 dark:border-slate-700">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white hover:border-neutral-300 dark:hover:border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal-info' && (
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div className="border border-neutral-200 dark:border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-main dark:text-white">
                    Personal Information
                  </h3>
                  <button className="size-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-text-muted dark:text-text-muted-dark">
                      edit
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      First Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {toTitleCase(agent.firstName) || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Middle Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Last Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {toTitleCase(agent.lastName) || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Email
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {agent.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Mobile No.
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {agent.mobile || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Date of Birth
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Street
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      City
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {agent.residentState || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Identity Section */}
              <div className="border border-neutral-200 dark:border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-main dark:text-white">
                    Identity
                  </h3>
                  <button className="size-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-text-muted dark:text-text-muted-dark">
                      edit
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      SSN
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Direct License
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {agent.licenseNumber || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      DOB
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Medicare MIB
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Medicare Part A
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Medicare Part B
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                </div>
              </div>

              {/* Family Information Section */}
              <div className="border border-neutral-200 dark:border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-main dark:text-white">
                    Family Information
                  </h3>
                  <button className="size-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-text-muted dark:text-text-muted-dark">
                      edit
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Spouse First Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Spouse Last Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Spouse Email
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Spouse Phone
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Spouse DOB
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Child First Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Child Last Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Child Email
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Child Phone
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Child DOB
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">-</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs - Placeholder */}
          {activeTab !== 'personal-info' && (
            <div className="py-12 text-center">
              <p className="text-text-muted dark:text-text-muted-dark">
                {tabs.find((t) => t.id === activeTab)?.label} content coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
