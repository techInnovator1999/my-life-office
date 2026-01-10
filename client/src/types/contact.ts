/**
 * Contact Types
 * Based on backend DTO
 */

export enum ContactType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  EMPLOYEE = 'EMPLOYEE',
}

export enum ContactStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export type Contact = {
  id: string
  contactType: ContactType
  firstName?: string | null
  lastName?: string | null
  email: string
  phoneNumber?: string | null
  workPhone?: string | null
  dateOfBirth?: Date | null
  primaryAddress?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  occupation?: string | null
  employer?: string | null
  spouse?: string | null
  ssn?: string | null
  mbiNumber?: string | null
  companyName?: string | null
  industryType?: string | null
  ownerName?: string | null
  ownerTitle?: string | null
  ownerEmail?: string | null
  ownerPhone?: string | null
  otherName?: string | null
  otherTitle?: string | null
  otherEmail?: string | null
  otherPhone?: string | null
  parentCompany?: string | null
  notes?: string | null
  source?: string | null
  referredBy?: string | null
  status: ContactStatus
  isLocked: boolean
  lockedAt?: Date | null
  lockedBy?: string | null
  isFromGoogle: boolean
  googleContactId?: string | null
  googleTags: string[]
  lastSyncedAt?: Date | null
  agentId: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type CreateContactDto = {
  contactType: ContactType
  firstName?: string
  lastName?: string
  email: string
  phoneNumber?: string
  workPhone?: string
  dateOfBirth?: Date
  companyName?: string
  source?: string
}

export type UpdateContactDto = {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  workPhone?: string
  dateOfBirth?: Date
  companyName?: string
  source?: string
}


