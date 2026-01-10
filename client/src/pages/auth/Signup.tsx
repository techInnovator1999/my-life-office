import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { PasswordStrength } from '@/components/common/PasswordStrength'
import { validators, type ValidationResult } from '@/utils/validators'
import logoMain from '@/assets/images/logo-main.png'
import logoMainLight from '@/assets/images/logo-main-light.png'

type FormErrors = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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

  // Real-time validation
  const validateField = (name: string, value: string): ValidationResult => {
    switch (name) {
      case 'firstName':
        return validators.combine(validators.required, validators.minLength(2))(value)
      case 'lastName':
        return validators.combine(validators.required, validators.minLength(2))(value)
      case 'email':
        return validators.combine(validators.required, validators.email)(value)
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
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      Object.values(errors).every((error) => !error)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword']
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
      // TODO: Implement signup logic
      setTimeout(() => setIsLoading(false), 1000)
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!isFormValid()}
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
