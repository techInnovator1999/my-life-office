import { useState, useEffect } from 'react'
import { useAuth } from '@/store/authContext'
import { Input } from '@/components/common/Input'
import { Select, type SelectOption } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { getLicenseTypes } from '@/services/licenseTypeService'
import { getRegions } from '@/services/regionService'
import { getTermLicenses } from '@/services/termLicenseService'
import { getProductsSold } from '@/services/productSoldService'
import { formatFullName, toTitleCase, formatMemberSince } from '@/utils/formatters'

type RegistrationType = 'INDIVIDUAL' | 'BUSINESS' | 'EMPLOYEE' | 'NOT_LICENSED'

type FormData = {
  registrationType: RegistrationType | ''
  firstName: string
  lastName: string
  email: string
  mobile: string
  primaryLicenseType: string
  residentState: string
  licenseNumber: string
  yearsLicensed: string
  priorProductsSold: string
  currentCompany: string
}

const STEPS = [
  { id: 1, label: 'Registration Type' },
  { id: 2, label: 'Profile Fillup' },
  { id: 3, label: 'Review & Submit' },
]

const REGISTRATION_TYPES: { value: RegistrationType; label: string; description: string; icon: string }[] = [
  {
    value: 'INDIVIDUAL',
    label: 'Solo Agent',
    description: 'You are a solo agent and direct to the General Agency. You can build a team.',
    icon: 'person',
  },
  {
    value: 'BUSINESS',
    label: 'Joining Team',
    description: 'You were invited to join an existing agents team. You will be asked to enter your uplines name.',
    icon: 'group_add',
  },
  {
    value: 'EMPLOYEE',
    label: 'Agency Manager',
    description: 'You have 5 or more licensed producing agents in your team and want to help manage their production.',
    icon: 'manage_accounts',
  },
  {
    value: 'NOT_LICENSED',
    label: 'Not Currently Licensed',
    description: '',
    icon: 'cancel',
  },
]

// Profile View Component for Approved Users
function ProfileView() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('personal-info')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [licenseTypeOptions, setLicenseTypeOptions] = useState<SelectOption[]>([])
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([])
  const [termLicenseOptions, setTermLicenseOptions] = useState<SelectOption[]>([])
  const [productSoldOptions, setProductSoldOptions] = useState<SelectOption[]>([])

  const tabs = [
    { id: 'personal-info', label: 'Personal Info' },
    { id: 'my-codes', label: 'My Codes' },
    { id: 'licensing', label: 'Licensing' },
    { id: 'education', label: 'Education' },
    { id: 'my-team', label: 'My Team' },
    { id: 'banking-info', label: 'Banking Info' },
  ]

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    mobile: user?.mobile || '',
    primaryLicenseType: user?.primaryLicenseType || '',
    residentState: user?.residentState || '',
    licenseNumber: user?.licenseNumber || '',
    yearsLicensed: user?.yearsLicensed?.toString() || '',
    priorProductsSold: user?.priorProductsSold || '',
    currentCompany: user?.currentCompany || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        mobile: user.mobile || '',
        primaryLicenseType: user.primaryLicenseType || '',
        residentState: user.residentState || '',
        licenseNumber: user.licenseNumber || '',
        yearsLicensed: user.yearsLicensed?.toString() || '',
        priorProductsSold: user.priorProductsSold || '',
        currentCompany: user.currentCompany || '',
      })
    }
  }, [user])

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [licenseTypes, regions, termLicenses, productsSold] = await Promise.all([
          getLicenseTypes(),
          getRegions(),
          getTermLicenses(),
          getProductsSold(),
        ])
        setLicenseTypeOptions(licenseTypes.map((item) => ({ label: item.label, value: item.value })))
        setRegionOptions(regions.map((item) => ({ label: item.label, value: item.value })))
        setTermLicenseOptions(termLicenses.map((item) => ({ label: item.label, value: item.value })))
        setProductSoldOptions(productsSold.map((item) => ({ label: item.label, value: item.value })))
      } catch (error) {
        console.error('Failed to fetch lookup data:', error)
      }
    }
    fetchLookupData()
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = async () => {
    // Validate
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSaving(true)
    try {
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage
      const token = storage.getItem('token')
      if (!token || !user?.id) {
        throw new Error('Not authenticated')
      }

      const { updateProfile } = await import('@/services/authService')
      await updateProfile(token, user.id, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobile: formData.mobile.trim() || null,
        primaryLicenseType: formData.primaryLicenseType || null,
        residentState: formData.residentState || null,
        licenseNumber: formData.licenseNumber.trim() || null,
        yearsLicensed: formData.yearsLicensed ? parseInt(formData.yearsLicensed) : null,
        priorProductsSold: formData.priorProductsSold || null,
        currentCompany: formData.currentCompany.trim() || null,
      })

      setIsEditing(false)
      // Force page reload to refresh user data from server
      window.location.reload()
    } catch (error) {
      console.error('Failed to update profile:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to update profile' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        mobile: user.mobile || '',
        primaryLicenseType: user.primaryLicenseType || '',
        residentState: user.residentState || '',
        licenseNumber: user.licenseNumber || '',
        yearsLicensed: user.yearsLicensed?.toString() || '',
        priorProductsSold: user.priorProductsSold || '',
        currentCompany: user.currentCompany || '',
      })
    }
    setErrors({})
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-main dark:text-white font-display">
          My Profile
        </h1>
        <p className="text-text-muted dark:text-text-muted-dark mt-1">
          View and manage your profile information
        </p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-neutral-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-semibold text-primary">
              {user?.firstName?.charAt(0) && user?.lastName?.charAt(0)
                ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                : user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-text-main dark:text-white truncate">
                {formatFullName(user?.firstName, user?.lastName)}
              </h2>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex-shrink-0">
                {user?.isApproved ? 'Approved' : 'Pending'}
              </span>
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              Member since: {user?.createdAt ? formatMemberSince(user.createdAt) : '-'}
            </p>
          </div>

          {/* User Details */}
          <div className="flex flex-col gap-2 text-right">
            <div>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">Status: <span className="text-sm font-semibold text-text-main dark:text-white">{user?.status?.name || '-'}</span></p>
            </div>
            <div>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">Role: <span className="text-sm font-semibold text-text-main dark:text-white">{user?.role?.name || '-'}</span></p>
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
            <div>
              {/* Profile Information Section */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-main dark:text-white">
                  Profile Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="size-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-text-muted dark:text-text-muted-dark">
                      edit
                    </span>
                  </button>
                )}
              </div>

              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                </div>
              )}

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    error={errors.lastName}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-neutral-50 dark:bg-slate-800"
                  />
                  <Input
                    label="Mobile No."
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    error={errors.mobile}
                    placeholder="Optional"
                  />
                  <Select
                    label="Primary License Type"
                    options={licenseTypeOptions}
                    value={formData.primaryLicenseType}
                    onChange={(value) => handleChange('primaryLicenseType', value)}
                    error={errors.primaryLicenseType}
                    placeholder="Optional"
                  />
                  <Select
                    label="Resident State"
                    options={regionOptions}
                    value={formData.residentState}
                    onChange={(value) => handleChange('residentState', value)}
                    error={errors.residentState}
                    placeholder="Optional"
                  />
                  <Input
                    label="License Number"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleChange('licenseNumber', e.target.value)}
                    error={errors.licenseNumber}
                    placeholder="Optional"
                  />
                  <Select
                    label="Years Licensed"
                    options={termLicenseOptions}
                    value={formData.yearsLicensed}
                    onChange={(value) => handleChange('yearsLicensed', value)}
                    error={errors.yearsLicensed}
                    placeholder="Optional"
                  />
                  <Select
                    label="Prior Products Sold"
                    options={productSoldOptions}
                    value={formData.priorProductsSold}
                    onChange={(value) => handleChange('priorProductsSold', value)}
                    error={errors.priorProductsSold}
                    placeholder="Optional"
                  />
                  <Input
                    label="Current Company"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={(e) => handleChange('currentCompany', e.target.value)}
                    error={errors.currentCompany}
                    placeholder="Optional"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      First Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {toTitleCase(formData.firstName) || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Last Name
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {toTitleCase(formData.lastName) || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Email
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {user?.email || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Mobile No.
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {formData.mobile || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Primary License Type
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {formData.primaryLicenseType || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Resident State
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {formData.residentState || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      License Number
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {formData.licenseNumber || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Years Licensed
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {formData.yearsLicensed || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Prior Products Sold
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {formData.priorProductsSold || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                      Current Company
                    </label>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {formData.currentCompany || '-'}
                    </p>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-neutral-200 dark:border-slate-700">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-codes' && (
            <div className="text-center py-12">
              <p className="text-text-muted dark:text-text-muted-dark">My Codes content coming soon</p>
            </div>
          )}

          {activeTab === 'licensing' && (
            <div className="text-center py-12">
              <p className="text-text-muted dark:text-text-muted-dark">Licensing content coming soon</p>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="text-center py-12">
              <p className="text-text-muted dark:text-text-muted-dark">Education content coming soon</p>
            </div>
          )}

          {activeTab === 'my-team' && (
            <div className="text-center py-12">
              <p className="text-text-muted dark:text-text-muted-dark">My Team content coming soon</p>
            </div>
          )}

          {activeTab === 'banking-info' && (
            <div className="text-center py-12">
              <p className="text-text-muted dark:text-text-muted-dark">Banking Info content coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Profile() {
  const { user } = useAuth()
  
  // If user is approved, show profile view instead of onboarding
  if (user?.isApproved) {
    return <ProfileView />
  }
  
  const [currentStep, setCurrentStep] = useState(1)
  const [licenseTypeOptions, setLicenseTypeOptions] = useState<SelectOption[]>([])
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([])
  const [termLicenseOptions, setTermLicenseOptions] = useState<SelectOption[]>([])
  const [productSoldOptions, setProductSoldOptions] = useState<SelectOption[]>([])
  const [isLoadingLicenseTypes, setIsLoadingLicenseTypes] = useState(true)
  const [isLoadingRegions, setIsLoadingRegions] = useState(true)
  const [isLoadingTermLicenses, setIsLoadingTermLicenses] = useState(true)
  const [isLoadingProductsSold, setIsLoadingProductsSold] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    registrationType: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    mobile: '',
    primaryLicenseType: '',
    residentState: '',
    licenseNumber: '',
    yearsLicensed: '',
    priorProductsSold: '',
    currentCompany: '',
  })

  useEffect(() => {
    if (user) {
      // Get primaryLicenseType from localStorage (set during signup) or user data
      const savedLicenseType = localStorage.getItem('primaryLicenseType') || ''
      
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        primaryLicenseType: savedLicenseType,
      }))
    }
  }, [user])

  // Fetch license types, regions, term licenses, and products sold
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingLicenseTypes(true)
        setIsLoadingRegions(true)
        setIsLoadingTermLicenses(true)
        setIsLoadingProductsSold(true)

        const [licenseTypes, regions, termLicenses, productsSold] = await Promise.all([
          getLicenseTypes(),
          getRegions(),
          getTermLicenses(),
          getProductsSold(),
        ])

        if (licenseTypes && Array.isArray(licenseTypes)) {
          setLicenseTypeOptions(
            licenseTypes.map((type) => ({
              value: type.value,
              label: type.label,
            }))
          )
          
          // Pre-select primaryLicenseType from localStorage if available
          const savedLicenseType = localStorage.getItem('primaryLicenseType')
          if (savedLicenseType && !formData.primaryLicenseType) {
            // Check if the saved value exists in the options
            const exists = licenseTypes.some((type) => type.value === savedLicenseType)
            if (exists) {
              setFormData((prev) => ({
                ...prev,
                primaryLicenseType: savedLicenseType,
              }))
            }
          }
        }

        if (regions && Array.isArray(regions)) {
          setRegionOptions(
            regions.map((region) => ({
              value: region.value,
              label: region.label,
            }))
          )
        }

        if (termLicenses && Array.isArray(termLicenses)) {
          setTermLicenseOptions(
            termLicenses.map((term) => ({
              value: term.value,
              label: term.label,
            }))
          )
        }

        if (productsSold && Array.isArray(productsSold)) {
          setProductSoldOptions(
            productsSold.map((product) => ({
              value: product.value,
              label: product.label,
            }))
          )
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoadingLicenseTypes(false)
        setIsLoadingRegions(false)
        setIsLoadingTermLicenses(false)
        setIsLoadingProductsSold(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // TODO: Implement profile update API call
      console.log('Profile update:', formData)
      // After successful submission, show success message
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStep1Valid = formData.registrationType !== ''
  const isStep2Valid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.primaryLicenseType !== ''

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-white font-display">
            Onboarding
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark mt-1">
            Complete your profile information. Your account is pending admin approval.
          </p>
        </div>
      </div>

      {/* Pending Approval Banner */}
      <div className="px-4 py-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
            pending
          </span>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Account Pending Approval
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
              Your account is verified but awaiting admin approval. You can update your profile in the meantime.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper - Compact Arrow Design */}
      <div className="relative mb-6">
        <div className="flex items-stretch bg-neutral-100 dark:bg-slate-800 rounded-lg shadow-lg border border-neutral-200 dark:border-slate-700 overflow-hidden">
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const stepNumber = index + 1
            const isLast = index === STEPS.length - 1
            const isFirst = index === 0

            // Determine background based on state
            const getBackground = () => {
              if (isActive) return 'bg-primary'
              if (isCompleted) return 'bg-green-500'
              return 'bg-neutral-100 dark:bg-slate-800'
            }

            const getTextColor = () => {
              if (isActive || isCompleted) return 'text-white'
              return 'text-neutral-600 dark:text-neutral-400'
            }

            // Calculate clipPath - Step 1 has straight left edge, Step 3 has straight right edge
            const getClipPath = () => {
              if (isFirst && isLast) {
                // Only one step - straight edges
                return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              } else if (isFirst) {
                // Step 1 - straight left, arrow right
                return 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)'
              } else if (isLast) {
                // Step 3 - arrow left, straight right
                return 'polygon(8px 50%, 0 0, 100% 0, 100% 100%, 0 100%)'
              } else {
                // Middle steps - arrow both sides
                return 'polygon(8px 50%, 0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)'
              }
            }

            return (
              <div key={step.id} className="flex items-stretch flex-1 relative" style={{ zIndex: STEPS.length - index }}>
                {/* Arrow Shape Container */}
                <div
                  className={`relative flex-1 ${getBackground()} ${
                    !isLast ? 'mr-[-6px]' : ''
                  } transition-all duration-300`}
                  style={{
                    clipPath: getClipPath(),
                  }}
                >
                  {/* Content */}
                  <div className="flex flex-col justify-center pl-4 pr-4 py-2.5 flex-1 min-h-[60px]">
                    {/* Step Number */}
                    <p className={`text-sm font-bold mb-0.5 ${getTextColor()}`}>
                      Step {stepNumber}
                    </p>
                    {/* Step Content - Aligned to start where "Step X" text ends */}
                    <p className={`text-xs font-bold ${getTextColor()}`} style={{ marginLeft: '0', paddingLeft: '0' }}>
                      {step.label}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-neutral-200 dark:border-[#302938]/50 p-6 lg:p-8">
        {/* Step 1: Registration Type */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                Select Your Registration Type
              </h2>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                Please select the type of agent registration that best fits your business model.
              </p>
            </div>

            {/* Main Registration Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {REGISTRATION_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('registrationType', type.value)}
                  className={`p-4 rounded-lg border bg-white dark:bg-surface-dark transition-colors text-left ${
                    formData.registrationType === type.value
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
                      : 'border-neutral-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`size-16 rounded-full flex items-center justify-center ${
                        formData.registrationType === type.value
                          ? 'bg-primary/20 text-primary'
                          : 'bg-neutral-100 dark:bg-slate-700 text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[32px]">{type.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-main dark:text-white">{type.label}</h3>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Profile Fillup */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                Complete Your Profile
              </h2>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                Please fill in all required information to complete your profile.
              </p>
            </div>

            {/* Personal Information */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold text-text-main dark:text-white">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  icon="person"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />

                <Input
                  label="Last Name"
                  type="text"
                  icon="person"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                icon="mail"
                value={formData.email}
                disabled
                placeholder="email@example.com"
              />

              <Input
                label="Mobile"
                type="tel"
                icon="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
              />
            </div>

            {/* License Information */}
            <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-text-main dark:text-white">
                License Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Primary License Type"
                  icon="badge"
                  options={licenseTypeOptions}
                  value={formData.primaryLicenseType}
                  onChange={(value) => handleChange('primaryLicenseType', value)}
                  placeholder={isLoadingLicenseTypes ? 'Loading...' : 'Select license type'}
                  required
                />

                <Select
                  label="Resident State"
                  icon="location_on"
                  options={regionOptions}
                  value={formData.residentState}
                  onChange={(value) => handleChange('residentState', value)}
                  placeholder={isLoadingRegions ? 'Loading...' : 'Select state'}
                />

                <Input
                  label="License Number"
                  type="text"
                  icon="badge"
                  placeholder="Enter license number"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                />

                <Select
                  label="Years Licensed"
                  icon="calendar_today"
                  options={termLicenseOptions}
                  value={formData.yearsLicensed}
                  onChange={(value) => handleChange('yearsLicensed', value)}
                  placeholder={isLoadingTermLicenses ? 'Loading...' : 'Select years licensed'}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-text-main dark:text-white">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Prior Products Sold"
                  icon="inventory"
                  options={productSoldOptions}
                  value={formData.priorProductsSold}
                  onChange={(value) => handleChange('priorProductsSold', value)}
                  placeholder={isLoadingProductsSold ? 'Loading...' : 'Select products'}
                />

                <Input
                  label="Current Company"
                  type="text"
                  icon="business"
                  placeholder="Enter company name"
                  value={formData.currentCompany}
                  onChange={(e) => handleChange('currentCompany', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                Review & Submit
              </h2>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                Please review your information before submitting.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              {/* Registration Type */}
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-slate-800">
                <h3 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark mb-2">
                  Registration Type
                </h3>
                <p className="text-base font-medium text-text-main dark:text-white">
                  {formData.registrationType === 'NOT_LICENSED'
                    ? 'Not Currently Licensed'
                    : REGISTRATION_TYPES.find((t) => t.value === formData.registrationType)?.label ||
                      'Not selected'}
                </p>
              </div>

              {/* Personal Information */}
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-slate-800">
                <h3 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">First Name</p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {toTitleCase(formData.firstName) || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Last Name</p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {toTitleCase(formData.lastName) || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Email</p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {formData.email || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Mobile</p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {formData.mobile || '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* License Information */}
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-slate-800">
                <h3 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark mb-3">
                  License Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      Primary License Type
                    </p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {formData.primaryLicenseType || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Resident State</p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {formData.residentState || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">License Number</p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {formData.licenseNumber || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Years Licensed</p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {formData.yearsLicensed || '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              {(formData.priorProductsSold || formData.currentCompany) && (
                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-slate-800">
                  <h3 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark mb-3">
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.priorProductsSold && (
                      <div>
                        <p className="text-xs text-text-muted dark:text-text-muted-dark">
                          Prior Products Sold
                        </p>
                        <p className="text-base font-medium text-text-main dark:text-white">
                          {formData.priorProductsSold}
                        </p>
                      </div>
                    )}
                    {formData.currentCompany && (
                      <div>
                        <p className="text-xs text-text-muted dark:text-text-muted-dark">
                          Current Company
                        </p>
                        <p className="text-base font-medium text-text-main dark:text-white">
                          {formData.currentCompany}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-neutral-200 dark:border-slate-700">
          <Button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back</span>
            </span>
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)
              }
              className="px-6"
            >
              <span className="flex items-center gap-2">
                <span>Continue</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            </Button>
          ) : (
            <Button type="submit" isLoading={isSubmitting} className="px-6">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Submit</span>
              </span>
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
