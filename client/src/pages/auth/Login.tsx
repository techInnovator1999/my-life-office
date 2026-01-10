import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { validators, type ValidationResult } from '@/utils/validators'
import { useAuth } from '@/store/authContext'
import logoMain from '@/assets/images/logo-main.png'
import logoMainLight from '@/assets/images/logo-main-light.png'

type FormErrors = {
  email?: string
  password?: string
}

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
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
      case 'email':
        return validators.combine(validators.required, validators.email)(value)
      case 'password':
        return validators.combine(validators.required, validators.minLength(6))(value)
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
      formData.password.trim() !== '' &&
      Object.values(errors).every((error) => !error)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = ['email', 'password']
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
        await login(formData.email, formData.password)
        navigate('/dashboard')
      } catch (error) {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password',
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
                  Hi, Welcome Back
                </h1>
                <p className="text-base font-medium text-neutral-500 dark:text-neutral-400 text-center">
                Sign in to your account to continue.
                </p>
              </div>


              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
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
                />

                {/* Password Field */}
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 items-center">
                      <input
                        className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-primary/25 dark:border-neutral-600 dark:bg-neutral-700"
                        id="remember"
                        type="checkbox"
                      />
                    </div>
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm font-bold text-primary hover:text-primary/80 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!isFormValid()}
                  className="mt-2 flex w-full items-center justify-center"
                >
                  <span className="flex items-center gap-2">
                    Sign In
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
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-primary hover:text-primary/80 hover:underline">
                Sign Up
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
