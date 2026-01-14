import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { validators, type ValidationResult } from '@/utils/validators'
import { resetPassword, verifyPasswordResetCode } from '@/services/authService'
import { useAuth } from '@/store/authContext'
import logoMain from '@/assets/images/logo-main.png'
import logoMainLight from '@/assets/images/logo-main-light.png'

type FormErrors = {
  email?: string
  code?: string
  password?: string
  confirmPassword?: string
}

export function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  
  // Check if user is logged in (coming from header) or not (coming from login page)
  const isResetPassword = !!user || !!(location.state as { fromHeader?: boolean })?.fromHeader
  
  const [formData, setFormData] = useState({
    email: (location.state as { email?: string })?.email || user?.email || '',
    code: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)

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
      case 'code':
        if (!value || value.trim().length === 0) {
          return { isValid: false, error: 'This field is required' }
        }
        if (value.length !== 6) {
          return { isValid: false, error: 'Verification code must be 6 digits' }
        }
        return { isValid: true }
      case 'password':
        return validators.combine(validators.required, validators.minLength(6))(value)
      case 'confirmPassword':
        if (!value) {
          return { isValid: false, error: 'Please confirm your password' }
        }
        if (value !== formData.password) {
          return { isValid: false, error: 'Passwords do not match' }
        }
        return { isValid: true }
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

    // Re-validate confirmPassword when password changes
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

  // Check if verification step is valid
  const isVerificationStepValid = () => {
    const emailValid = formData.email.trim() !== '' && !errors.email
    const codeValid = formData.code.trim() !== '' && formData.code.length === 6 && !errors.code
    return emailValid && codeValid
  }

  // Check if password reset step is valid
  const isPasswordStepValid = () => {
    return (
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      formData.password === formData.confirmPassword &&
      !errors.password &&
      !errors.confirmPassword
    )
  }

  // Handle verification code verification
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark email and code as touched
    const newTouched: Record<string, boolean> = { email: true, code: true }
    const newErrors: FormErrors = {}

    const emailResult = validateField('email', formData.email)
    const codeResult = validateField('code', formData.code)

    if (!emailResult.isValid) {
      newErrors.email = emailResult.error
    }
    if (!codeResult.isValid) {
      newErrors.code = codeResult.error
    }

    setTouched(newTouched)
    setErrors(newErrors)

    // Check if there are any validation errors
    const hasErrors = Object.keys(newErrors).length > 0
    
    // Only verify if form is valid (no errors and fields are filled)
    if (!hasErrors && formData.email.trim() !== '' && formData.code.trim() !== '' && formData.code.length === 6) {
      setIsVerifying(true)
      try {
        await verifyPasswordResetCode(formData.email, formData.code)
        setCodeVerified(true)
        // Clear all errors on success
        setErrors({})
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Invalid verification code'
        setErrors((prev) => ({ ...prev, code: errorMessage }))
      } finally {
        setIsVerifying(false)
      }
    }
  }

  // Handle password reset submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark password fields as touched
    const newTouched: Record<string, boolean> = { password: true, confirmPassword: true }
    const newErrors: FormErrors = {}

    const passwordResult = validateField('password', formData.password)
    const confirmPasswordResult = validateField('confirmPassword', formData.confirmPassword)

    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.error
    }
    if (!confirmPasswordResult.isValid) {
      newErrors.confirmPassword = confirmPasswordResult.error
    }

    setTouched(newTouched)
    setErrors(newErrors)

    // Only submit if form is valid
    if (isPasswordStepValid() && Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      try {
        await resetPassword(formData.email, formData.password, formData.code)
        setPasswordReset(true)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to reset password'
        setErrors({ password: errorMessage })
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
                  Reset Password
                </h1>
                <p className="text-base font-medium text-neutral-500 dark:text-neutral-400 text-center">
                  {codeVerified 
                    ? 'Enter your new password below.'
                    : 'Enter your verification code to continue.'}
                </p>
              </div>

              {/* Code Verified Success Message */}
              {codeVerified && !passwordReset && (
                <div className="px-4 py-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">
                      check_circle
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Verification code verified!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Please enter your new password below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Reset Success Message */}
              {passwordReset && (
                <div className="px-4 py-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">
                      check_circle
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Password reset successfully!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your password has been reset. You can now sign in with your new password.
                      </p>
                      <div className="mt-4">
                        <Button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="w-full"
                        >
                          Go to Login
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Verification Code Form */}
              {!codeVerified && !passwordReset && (
                <form onSubmit={handleVerifyCode} className="flex flex-col gap-5 mt-2" autoComplete="off">
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
                    disabled={isVerifying}
                  />

                  {/* Verification Code Field */}
                  <Input
                    label="Verification Code"
                    type="text"
                    icon="lock"
                    placeholder="Enter 6-digit code"
                    value={formData.code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      handleChange('code', value)
                    }}
                    onBlur={() => handleBlur('code')}
                    error={errors.code}
                    required
                    maxLength={6}
                    autoComplete="off"
                    disabled={isVerifying}
                  />

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    isLoading={isVerifying}
                    disabled={isVerifying || formData.email.trim() === '' || formData.code.trim() === '' || formData.code.length !== 6}
                    className="mt-2 flex w-full items-center justify-center"
                  >
                    <span className="flex items-center gap-2">
                      Verify Code
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </span>
                  </Button>
                </form>
              )}

              {/* Step 2: Password Reset Form */}
              {codeVerified && !passwordReset && (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-5 mt-2" autoComplete="off">
                  {/* Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                      New Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        icon="lock"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        error={errors.password}
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      {formData.password.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none dark:hover:text-neutral-200 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 ml-1">
                      Confirm Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        icon="lock"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      {formData.confirmPassword.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none dark:hover:text-neutral-200 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showConfirmPassword ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reset Password Button */}
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!isPasswordStepValid()}
                    className="mt-2 flex w-full items-center justify-center"
                  >
                    <span className="flex items-center gap-2">
                      Reset Password
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </span>
                  </Button>
                </form>
              )}

              {/* Cancel / Back to Login */}
              {!passwordReset && (
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
              )}
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
                <span className="material-symbols-outlined text-base">security</span>
                <span>Secure Password Reset</span>
              </span>
            </div>
            <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight lg:text-6xl drop-shadow-sm">
              Create a new <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                secure password.
              </span>
            </h2>
            <p className="mb-8 text-xl font-light text-purple-50 max-w-lg leading-relaxed opacity-90">
              Enter the verification code sent to your email and create a new password for your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

