/**
 * Validation utilities for form fields
 */

export type ValidationResult = {
  isValid: boolean
  error?: string
}

export const validators = {
  required: (value: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
      return { isValid: false, error: 'This field is required' }
    }
    return { isValid: true }
  },

  minLength: (min: number) => (value: string): ValidationResult => {
    if (value.length < min) {
      return { isValid: false, error: `Must be at least ${min} characters` }
    }
    return { isValid: true }
  },

  email: (value: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return { isValid: false, error: 'Please enter a valid email address' }
    }
    return { isValid: true }
  },

  passwordMatch: (password: string) => (confirmPassword: string): ValidationResult => {
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' }
    }
    return { isValid: true }
  },

  combine: (...validators: Array<(value: string) => ValidationResult>) => {
    return (value: string): ValidationResult => {
      for (const validator of validators) {
        const result = validator(value)
        if (!result.isValid) {
          return result
        }
      }
      return { isValid: true }
    }
  },
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export const calculatePasswordStrength = (password: string): {
  strength: PasswordStrength
  score: number
  feedback: string[]
} => {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('At least 8 characters')
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('One lowercase letter')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('One uppercase letter')
  }

  if (/[0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('One number')
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('One special character')
  }

  if (password.length >= 12) {
    score += 1
  }

  let strength: PasswordStrength = 'weak'
  if (score <= 2) {
    strength = 'weak'
  } else if (score === 3) {
    strength = 'fair'
  } else if (score === 4) {
    strength = 'good'
  } else {
    strength = 'strong'
  }

  return { strength, score, feedback }
}

