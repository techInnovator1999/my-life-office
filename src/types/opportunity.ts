/**
 * Opportunity Types
 * Based on Prisma schema
 */

export enum PipelineStage {
  LEADS_INTEREST = 'LEADS_INTEREST',
  PROSPECT_QUOTE = 'PROSPECT_QUOTE',
  PROSPECT_APP_SIGNED = 'PROSPECT_APP_SIGNED',
  PROSPECT_UNDERWRITING = 'PROSPECT_UNDERWRITING',
  CLIENT_WON_IN_FORCE = 'CLIENT_WON_IN_FORCE',
  LOST_LOST = 'LOST_LOST',
}

export enum Temperature {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
  UNKNOWN = 'UNKNOWN',
}

export type Opportunity = {
  id: string
  name: string
  service?: string | null
  createDate: string
  pipelineStage: PipelineStage
  temperature?: Temperature | null
  nextFollowUp?: string | null
  estimateCloseTarget?: string | null
  opportunitySource?: string | null
  referredBy?: string | null
  writingAgent?: string | null
  split?: string | null
  serviceSubType?: string | null
  carrier?: string | null
  product?: string | null
  estAnnualPremium?: number | null
  opportunityAmount?: number | null
  isLocked: boolean
  lockedAt?: string | null
  lockedBy?: string | null
  contactId: string
  agentId: string
  contact?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
  }
  createdAt: string
  updatedAt: string
}

export type CreateOpportunityDto = {
  name: string
  service?: string
  pipelineStage: PipelineStage
  temperature?: Temperature
  contactId: string
  opportunitySource?: string
  estAnnualPremium?: number
  opportunityAmount?: number
}

export type UpdateOpportunityDto = {
  name?: string
  service?: string
  pipelineStage?: PipelineStage
  temperature?: Temperature
  nextFollowUp?: string
  estimateCloseTarget?: string
  opportunitySource?: string
  estAnnualPremium?: number
  opportunityAmount?: number
}

// Stage configuration for display
export type StageConfig = {
  id: PipelineStage
  label: string
  color: string
  bgColor: string
  order: number
}

export const STAGE_CONFIGS: Record<PipelineStage, StageConfig> = {
  [PipelineStage.LEADS_INTEREST]: {
    id: PipelineStage.LEADS_INTEREST,
    label: 'Interest',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30', // Soft blue
    order: 0,
  },
  [PipelineStage.PROSPECT_QUOTE]: {
    id: PipelineStage.PROSPECT_QUOTE,
    label: 'Quote',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30', // Light orange
    order: 1,
  },
  [PipelineStage.PROSPECT_APP_SIGNED]: {
    id: PipelineStage.PROSPECT_APP_SIGNED,
    label: 'App Signed',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-200 dark:bg-orange-900/40', // Different light orange shade
    order: 2,
  },
  [PipelineStage.PROSPECT_UNDERWRITING]: {
    id: PipelineStage.PROSPECT_UNDERWRITING,
    label: 'Underwriting',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-300 dark:bg-orange-900/50', // Different light orange shade
    order: 3,
  },
  [PipelineStage.CLIENT_WON_IN_FORCE]: {
    id: PipelineStage.CLIENT_WON_IN_FORCE,
    label: 'In Force',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30', // Soft green
    order: 4,
  },
  [PipelineStage.LOST_LOST]: {
    id: PipelineStage.LOST_LOST,
    label: 'Lost',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30', // Soft red
    order: 5,
  },
}

export const STAGE_ORDER: PipelineStage[] = [
  PipelineStage.LEADS_INTEREST,
  PipelineStage.PROSPECT_QUOTE,
  PipelineStage.PROSPECT_APP_SIGNED,
  PipelineStage.PROSPECT_UNDERWRITING,
  PipelineStage.CLIENT_WON_IN_FORCE,
  PipelineStage.LOST_LOST,
]

// Pipeline categories for grouping stages
export enum PipelineCategory {
  LEADS = 'LEADS',
  PROSPECTS = 'PROSPECTS',
  IN_FORCE = 'IN_FORCE',
  LOST = 'LOST',
}

export type CategoryConfig = {
  id: PipelineCategory
  label: string
  stages: PipelineStage[]
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: PipelineCategory.LEADS,
    label: 'Leads',
    stages: [PipelineStage.LEADS_INTEREST],
  },
  {
    id: PipelineCategory.PROSPECTS,
    label: 'Prospects',
    stages: [
      PipelineStage.PROSPECT_QUOTE,
      PipelineStage.PROSPECT_APP_SIGNED,
      PipelineStage.PROSPECT_UNDERWRITING,
    ],
  },
  {
    id: PipelineCategory.IN_FORCE,
    label: 'In-Force',
    stages: [PipelineStage.CLIENT_WON_IN_FORCE],
  },
  {
    id: PipelineCategory.LOST,
    label: 'Lost',
    stages: [PipelineStage.LOST_LOST],
  },
]

// Category color configuration
export type CategoryColorConfig = {
  labelColor: string
  containerBg: string
  containerBgDark: string
  headerBg: string
  headerBgDark: string
  borderColor: string
  borderColorDark: string
  separatorBorder: string
  separatorBorderDark: string
  cardBorder: string
  cardBorderDark: string
}

export const CATEGORY_COLORS: Record<PipelineCategory, CategoryColorConfig> = {
  [PipelineCategory.LEADS]: {
    labelColor: 'text-blue-600 dark:text-blue-400',
    containerBg: 'bg-blue-50',
    containerBgDark: 'dark:bg-blue-900/20',
    headerBg: 'bg-blue-100',
    headerBgDark: 'dark:bg-blue-900/30',
    borderColor: 'border-blue-300',
    borderColorDark: 'dark:border-blue-700',
    separatorBorder: 'border-blue-300',
    separatorBorderDark: 'dark:border-blue-700',
    cardBorder: 'border-blue-300',
    cardBorderDark: 'dark:border-blue-700',
  },
  [PipelineCategory.PROSPECTS]: {
    labelColor: 'text-orange-600 dark:text-orange-400',
    containerBg: 'bg-orange-50',
    containerBgDark: 'dark:bg-orange-900/20',
    headerBg: 'bg-orange-100',
    headerBgDark: 'dark:bg-orange-900/30',
    borderColor: 'border-orange-300',
    borderColorDark: 'dark:border-orange-700',
    separatorBorder: 'border-orange-300',
    separatorBorderDark: 'dark:border-orange-700',
    cardBorder: 'border-orange-300',
    cardBorderDark: 'dark:border-orange-700',
  },
  [PipelineCategory.IN_FORCE]: {
    labelColor: 'text-green-600 dark:text-green-400',
    containerBg: 'bg-green-50',
    containerBgDark: 'dark:bg-green-900/20',
    headerBg: 'bg-green-100',
    headerBgDark: 'dark:bg-green-900/30',
    borderColor: 'border-green-300',
    borderColorDark: 'dark:border-green-700',
    separatorBorder: 'border-green-300',
    separatorBorderDark: 'dark:border-green-700',
    cardBorder: 'border-green-300',
    cardBorderDark: 'dark:border-green-700',
  },
  [PipelineCategory.LOST]: {
    labelColor: 'text-red-600 dark:text-red-400',
    containerBg: 'bg-red-50',
    containerBgDark: 'dark:bg-red-900/20',
    headerBg: 'bg-red-100',
    headerBgDark: 'dark:bg-red-900/30',
    borderColor: 'border-red-300',
    borderColorDark: 'dark:border-red-700',
    separatorBorder: 'border-red-300',
    separatorBorderDark: 'dark:border-red-700',
    cardBorder: 'border-red-300',
    cardBorderDark: 'dark:border-red-700',
  },
}



