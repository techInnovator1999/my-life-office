import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { validators, type ValidationResult } from '@/utils/validators'
import { forgotPassword } from '@/services/authService'
import { useAuth } from '@/store/authContext'
import logoMain from '@/assets/images/logo-main.png'
import logoMainLight from '@/assets/images/logo-main-light.png'

type FormErrors = {
  email?: string
}

export function ForgotPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  
  // Check if user is logged in (coming from header) or not (coming from login page)
  const isResetPassword = !!user || !!(location.state as { fromHeader?: boolean })?.fromHeader
  
  const [formData, setFormData] = useState({
    email: (location.state as { email?: string })?.email || user?.email || '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

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
      case 'email':
        return validators.combine(validators.required, validators.email)(value)
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
      formData.email.trim() !== '' &&
      Object.values(errors).every((error) => !error)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = ['email']
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
        await forgotPassword(formData.email)
        setEmailSent(true)
      } catch (error) {
        setErrors({
          email: error instanceof Error ? error.message : 'Failed to send reset email',
        })
      } finally {
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
              <div className="flex flex-col gap-2 items-center">
                <img
                  src={isDark ? logoMainLight : logoMain}
                  alt="CRM Nexus Logo"
                  className={`${isDark ? 'w-[268px] h-16' : 'w-[268px] h-12'} mb-2 object-contain`}
                />
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                  {isResetPassword ? 'Reset Password' : 'Forgot Password?'}
                </h1>
                <p className="text-base font-medium text-neutral-500 dark:text-neutral-400 text-center">
                  {isResetPassword 
                    ? 'Enter your email to receive a verification code for resetting your password.'
                    : "No worries, we'll send you reset instructions."}
                </p>
              </div>

              {/* Email Sent Success Message */}
              {emailSent && (
                <div className="px-4 py-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">
                      check_circle
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Reset code sent!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        We've sent a verification code to <strong>{formData.email}</strong>. Please check your email and use the code to reset your password.
                      </p>
                      <div className="mt-4">
                        <Button
                          type="button"
                          onClick={() => navigate('/reset-password', { state: { email: formData.email, fromHeader: isResetPassword } })}
                          className="w-full"
                        >
                          Continue to Reset Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              {!emailSent && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2" autoComplete="off">
                  {/* Email Field */}
                  <Input
                    label="Email"
                    type="email"
                    icon="mail"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    required
                    autoComplete="off"
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!isFormValid()}
                    className="mt-2 flex w-full items-center justify-center"
                  >
                    <span className="flex items-center gap-2">
                      {isResetPassword ? 'Send Verification Code' : 'Send Reset Code'}
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </span>
                  </Button>
                </form>
              )}

              {/* Cancel / Back to Login */}
              <div className="text-center">
                {isResetPassword ? (
                  <button
                    onClick={() => navigate(-1)}
                    className="text-sm font-medium text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm font-medium text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_back
                    </span>
                    Back to Login
                  </button>
                )}
              </div>
            </div>
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
                <span className="material-symbols-outlined text-base">lock</span>
                <span>Secure Password Reset</span>
              </span>
            </div>
            <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight lg:text-6xl drop-shadow-sm">
              Reset your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                password securely.
              </span>
            </h2>
            <p className="mb-8 text-xl font-light text-purple-50 max-w-lg leading-relaxed opacity-90">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

