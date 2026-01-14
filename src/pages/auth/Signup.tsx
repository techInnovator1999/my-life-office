import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select, type SelectOption } from '@/components/common/Select'
import { PasswordStrength } from '@/components/common/PasswordStrength'
import { validators, type ValidationResult } from '@/utils/validators'
import { getLicenseTypes } from '@/services/licenseTypeService'
import { crmRegister } from '@/services/crmAuthService'
import { confirmEmail } from '@/services/authService'
import logoMain from '@/assets/images/logo-main.png'
import logoMainLight from '@/assets/images/logo-main-light.png'

type FormErrors = {
  firstName?: string
  lastName?: string
  email?: string
  primaryLicenseType?: string
  password?: string
  confirmPassword?: string
}

export function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    primaryLicenseType: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [licenseTypeOptions, setLicenseTypeOptions] = useState<SelectOption[]>([])
  const [isLoadingLicenseTypes, setIsLoadingLicenseTypes] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    
    return () => observer.disconnect()
  }, [])

  // Fetch license types on mount
  useEffect(() => {
    const fetchLicenseTypes = async () => {
      try {
        setIsLoadingLicenseTypes(true)
        const types = await getLicenseTypes()
        
        if (types && Array.isArray(types) && types.length > 0) {
          const options = types.map((type) => ({
            value: type.value,
            label: type.label,
          }))
          setLicenseTypeOptions(options)
        } else {
          setErrors((prev) => ({
            ...prev,
            primaryLicenseType: 'No license types available. Please contact support.',
          }))
        }
      } catch (error) {
        console.error('Failed to fetch license types:', error)
        setErrors((prev) => ({
          ...prev,
          primaryLicenseType: error instanceof Error ? error.message : 'Failed to load license types. Please refresh the page.',
        }))
      } finally {
        setIsLoadingLicenseTypes(false)
      }
    }

    fetchLicenseTypes()
  }, [])

  // Real-time validation
  const validateField = (name: string, value: string): ValidationResult => {
    switch (name) {
      case 'firstName':
        return validators.combine(validators.required, validators.minLength(2))(value)
      case 'lastName':
        return validators.combine(validators.required, validators.minLength(2))(value)
      case 'email':
        return validators.combine(validators.required, validators.email)(value)
      case 'primaryLicenseType':
        return validators.required(value)
      case 'password':
        return validators.combine(validators.required, validators.minLength(8))(value)
      case 'confirmPassword':
        return validators.combine(
          validators.required,
          validators.passwordMatch(formData.password)
        )(value)
      default:
        return { isValid: true }
    }
  }

  // Handle field change with validation
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate on change if field has been touched
    if (touched[name]) {
      const result = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: result.isValid ? undefined : result.error,
      }))
    }

    // Special handling for confirm password when password changes
    if (name === 'password' && touched.confirmPassword) {
      const confirmResult = validateField('confirmPassword', formData.confirmPassword)
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmResult.isValid ? undefined : confirmResult.error,
      }))
    }
  }

  // Handle blur - mark as touched and validate
  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const result = validateField(name, formData[name as keyof typeof formData])
    setErrors((prev) => ({
      ...prev,
      [name]: result.isValid ? undefined : result.error,
    }))
  }

  // Check if form is valid
  const isFormValid = () => {
    return (
      agreeToTerms &&
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.primaryLicenseType.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      Object.values(errors).every((error) => !error)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    // Mark all fields as touched
    const allFields = ['firstName', 'lastName', 'email', 'primaryLicenseType', 'password', 'confirmPassword']
    const newTouched: Record<string, boolean> = {}
    const newErrors: FormErrors = {}

    allFields.forEach((field) => {
      newTouched[field] = true
      const result = validateField(field, formData[field as keyof typeof formData])
      if (!result.isValid) {
        newErrors[field as keyof FormErrors] = result.error
      }
    })

    setTouched(newTouched)
    setErrors(newErrors)

    // Only submit if form is valid
    if (isFormValid() && Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      try {
        // Save primaryLicenseType to localStorage for profile page
        localStorage.setItem('primaryLicenseType', formData.primaryLicenseType)
        
        await crmRegister({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirm_password: formData.confirmPassword,
          primaryLicenseType: formData.primaryLicenseType,
        })

        // Success - show success message
        setIsRegistrationSuccess(true)
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.')
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white antialiased">
      {/* Left Side: Form Section */}
      <div className="relative flex w-full flex-col justify-center bg-white dark:bg-surface-dark-alt lg:w-[45%] xl:w-[40%] shadow-2xl z-10">
        <div className="flex h-full w-full flex-col overflow-y-auto no-scrollbar">

          {/* Main Form Content */}
          <div className="flex grow flex-col justify-center px-8 py-6 lg:px-12">
            <div className="mx-auto w-full max-w-[420px] flex flex-col gap-6">
              {/* Success Screen */}
              {isRegistrationSuccess ? (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                  {!isVerified ? (
                    <>
                      {/* Success Icon */}
                      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
                        <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
                          mail
                        </span>
                      </div>

                      {/* Success Messages */}
                      <div className="flex flex-col gap-4 text-center">
                        <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                          Registration successful!
                        </p>
                        <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                          We've sent a verification code to <strong>{formData.email}</strong>. Please enter the code below to verify your email address.
                        </p>
                      </div>

                      {/* Verification Code Input */}
                      <div className="w-full max-w-md flex flex-col gap-2">
                        <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                          Verification Code
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                              setVerificationCode(value)
                              setVerificationError(null)
                            }}
                            maxLength={6}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={async () => {
                              if (verificationCode.length !== 6) {
                                setVerificationError('Please enter a 6-digit verification code')
                                return
                              }
                              
                              setIsVerifying(true)
                              setVerificationError(null)
                              
                              try {
                                await confirmEmail(formData.email, verificationCode)
                                setIsVerified(true)
                                // Redirect to login after successful verification
                                setTimeout(() => {
                                  navigate('/login')
                                }, 2000)
                              } catch (error) {
                                setVerificationError(error instanceof Error ? error.message : 'Invalid verification code')
                              } finally {
                                setIsVerifying(false)
                              }
                            }}
                            isLoading={isVerifying}
                            disabled={verificationCode.length !== 6 || isVerifying}
                            className="px-6"
                          >
                            Verify
                          </Button>
                        </div>
                        {verificationError && (
                          <p className="text-sm text-red-600 dark:text-red-400 ml-1">{verificationError}</p>
                        )}
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2">
                          Didn't receive the code? Check your spam folder or{' '}
                          <Link
                            to="/login"
                            className="font-bold text-primary hover:text-primary/80 hover:underline"
                          >
                            proceed to login
                          </Link>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Verified Success Icon */}
                      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
                        <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
                          check_circle
                        </span>
                      </div>

                      {/* Verified Success Messages */}
                      <div className="flex flex-col gap-4 text-center">
                        <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                          Email verified successfully!
                        </p>
                        <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                          Redirecting you to login...
                        </p>
                        <p className="text-sm font-normal text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md">
                          You will have limited Agent portal access until your account is approved by the CRM team, with 1-2 business days.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* Logo */}
                  <div className="flex flex-col gap-2 items-center">
                    <img
                      src={isDark ? logoMainLight : logoMain}
                      alt="CRM Nexus Logo"
                      className={`${isDark ? 'w-[268px] h-16' : 'w-[268px] h-12'} mb-2 object-contain`}
                    />
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                      Create your CRM Account
                    </h1>
                    <p className="text-base font-medium text-neutral-500 dark:text-neutral-400 text-center">
                      Get ready to be captivated by our amazing CRM and Agent management office
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
                {/* Name Fields Row */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* First Name */}
                  <Input
                    label="First Name"
                    type="text"
                    icon="person"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    error={errors.firstName}
                    required
                  />

                  {/* Last Name */}
                  <Input
                    label="Last Name"
                    type="text"
                    icon="person"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    error={errors.lastName}
                    required
                  />
                </div>

                {/* Email Field */}
                <Input
                  label="Work Email"
                  type="email"
                  icon="mail"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={errors.email}
                  required
                  autoComplete="email"
                />

                {/* License Type Field */}
                <Select
                  label="Primary License Type"
                  icon="badge"
                  options={licenseTypeOptions}
                  value={formData.primaryLicenseType}
                  onChange={(value) => handleChange('primaryLicenseType', value)}
                  onBlur={() => handleBlur('primaryLicenseType')}
                  error={errors.primaryLicenseType}
                  required
                  placeholder={isLoadingLicenseTypes ? 'Loading...' : 'Select license type'}
                />

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                      Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        error={errors.password}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none dark:hover:text-neutral-200 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                    <PasswordStrength password={formData.password} />
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                      Confirm Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none dark:hover:text-neutral-200 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirmPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 mt-1">
                  <div className="flex h-6 items-center">
                    <input
                      className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary/25 dark:border-neutral-600 dark:bg-neutral-700"
                      id="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label className="font-medium text-neutral-600 dark:text-neutral-400" htmlFor="terms">
                      I agree to the{' '}
                      <a className="font-bold text-primary hover:underline" href="#">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a className="font-bold text-primary hover:underline" href="#">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!isFormValid() || isLoadingLicenseTypes}
                  className="mt-2 flex w-full items-center justify-center"
                >
                  <span className="flex items-center gap-2">
                    Create Account
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </span>
                </Button>
              </form>
                </>
              )}
            </div>
          </div>

          {/* Footer Area */}
          <div className="px-8 pb-8 pt-4 lg:px-12 text-center lg:text-left">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Already a member?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary/80 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <div className="relative hidden w-0 lg:block lg:w-[55%] xl:w-[60%]">
        {/* Background Image */}
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?semt=ais_hybrid&w=740&q=80")',
          }}
        >
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/50 to-transparent"></div>
        </div>

        {/* Floating Content on Right Side */}
        <div className="absolute inset-0 flex flex-col justify-end p-16 xl:p-24">
          <div className="max-w-2xl text-white">
            <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>New v2.0 Released</span>
              </span>
            </div>
            <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight lg:text-6xl drop-shadow-sm">
              Unlock your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                sales potential.
              </span>
            </h2>
            <p className="mb-8 text-xl font-light text-purple-50 max-w-lg leading-relaxed opacity-90">
              Join the next generation of Lead & Opportunity Management. Transform how you connect with customers
              today.
            </p>
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                Smart Analytics
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Real-time Sync
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined text-[18px]">security</span>
                Enterprise Security
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
