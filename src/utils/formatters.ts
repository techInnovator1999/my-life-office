/**
 * Converts a string to title case (first letter uppercase, rest lowercase)
 * Handles null/undefined/empty strings gracefully
 * 
 * @param str - String to convert to title case
 * @returns Title case string or empty string if input is falsy
 * 
 * @example
 * toTitleCase('john') // 'John'
 * toTitleCase('JOHN') // 'John'
 * toTitleCase('john doe') // 'John Doe'
 * toTitleCase(null) // ''
 * toTitleCase('') // ''
 */
export function toTitleCase(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Formats firstName and lastName as a full name in title case
 * 
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Formatted full name in title case
 * 
 * @example
 * formatFullName('john', 'doe') // 'John Doe'
 * formatFullName('JOHN', 'DOE') // 'John Doe'
 * formatFullName('john', null) // 'John'
 */
export function formatFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  const first = toTitleCase(firstName)
  const last = toTitleCase(lastName)
  return [first, last].filter(Boolean).join(' ')
}

/**
 * Formats a date as "member since" in human-readable format
 * 
 * @param date - Date string or Date object
 * @returns Human-readable time difference (e.g., "2 months", "1 year", "3 days")
 * 
 * @example
 * formatMemberSince('2024-01-01T00:00:00Z') // '2 months' (if current date is March 2024)
 * formatMemberSince(new Date('2023-01-01')) // '1 year'
 */
export function formatMemberSince(date: string | Date | null | undefined): string {
  if (!date) return '-'
  
  const createdDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - createdDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 1) {
    return 'Today'
  } else if (diffInDays === 1) {
    return '1 day'
  } else if (diffInDays < 7) {
    return `${diffInDays} days`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return weeks === 1 ? '1 week' : `${weeks} weeks`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return months === 1 ? '1 month' : `${months} months`
  } else {
    const years = Math.floor(diffInDays / 365)
    return years === 1 ? '1 year' : `${years} years`
  }
}

