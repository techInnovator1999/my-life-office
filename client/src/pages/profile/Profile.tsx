import { useState, useEffect } from 'react'
import { useAuth } from '@/store/authContext'
import { Input } from '@/components/common/Input'
import { Select, type SelectOption } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { getLicenseTypes } from '@/services/licenseTypeService'
import { getRegions } from '@/services/regionService'

type RegistrationType = 'INDIVIDUAL' | 'BUSINESS' | 'EMPLOYEE'

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
    label: 'Individual',
    description: 'Operate independently under your own brand.',
    icon: 'person',
  },
  {
    value: 'BUSINESS',
    label: 'Business',
    description: 'Register your business structure.',
    icon: 'business',
  },
  {
    value: 'EMPLOYEE',
    label: 'Employee',
    description: 'Work directly with an existing agency team.',
    icon: 'groups',
  },
]

export function Profile() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [licenseTypeOptions, setLicenseTypeOptions] = useState<SelectOption[]>([])
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([])
  const [isLoadingLicenseTypes, setIsLoadingLicenseTypes] = useState(true)
  const [isLoadingRegions, setIsLoadingRegions] = useState(true)
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

  // Fetch license types and regions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingLicenseTypes(true)
        setIsLoadingRegions(true)

        const [licenseTypes, regions] = await Promise.all([
          getLicenseTypes(),
          getRegions(),
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
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoadingLicenseTypes(false)
        setIsLoadingRegions(false)
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {REGISTRATION_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('registrationType', type.value)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    formData.registrationType === type.value
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-neutral-200 dark:border-[#302938] hover:border-primary/50 hover:shadow-sm'
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
            <div className="space-y-4 pt-6 border-t-2 border-neutral-300 dark:border-[#302938] dark:border-opacity-100">
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

                <Input
                  label="Years Licensed"
                  type="number"
                  icon="calendar_today"
                  placeholder="Enter years"
                  value={formData.yearsLicensed}
                  onChange={(e) => handleChange('yearsLicensed', e.target.value)}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4 pt-6 border-t-2 border-neutral-300 dark:border-[#302938] dark:border-opacity-100">
              <h3 className="text-lg font-semibold text-text-main dark:text-white">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prior Products Sold"
                  type="text"
                  icon="inventory"
                  placeholder="Enter products"
                  value={formData.priorProductsSold}
                  onChange={(e) => handleChange('priorProductsSold', e.target.value)}
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
                  {REGISTRATION_TYPES.find((t) => t.value === formData.registrationType)?.label ||
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
                      {formData.firstName || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Last Name</p>
                    <p className="text-base font-medium text-text-main dark:text-white">
                      {formData.lastName || '—'}
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
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-neutral-200 dark:border-[#302938]">
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
