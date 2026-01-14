/**
 * Opportunity Service
 * 
 * Handles API calls for opportunities
 */

import { Opportunity, UpdateOpportunityDto, PipelineStage } from '@/types/opportunity'

/**
 * Get all opportunities for current user
 */
export async function getOpportunities(): Promise<Opportunity[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date()
      const opportunities: Opportunity[] = []

      // Helper function to create opportunity
      const createOpportunity = (
        id: string,
        firstName: string,
        lastName: string,
        service: string,
        stage: PipelineStage,
        temperature: 'HOT' | 'WARM' | 'COLD' | 'UNKNOWN',
        premium: number
      ): Opportunity => ({
        id,
        name: `${firstName} ${lastName} - ${service}`,
        service,
        createDate: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        pipelineStage: stage,
        temperature,
        estAnnualPremium: premium,
        opportunityAmount: premium,
        contactId: id,
        agentId: '1',
        isLocked: false,
        contact: {
          id,
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // 5 cards in LEADS_INTEREST
      const leadsNames = [
        ['Alice', 'Williams', 'Life Insurance'],
        ['Michael', 'Brown', 'Health Insurance'],
        ['Sarah', 'Davis', 'Annuity'],
        ['David', 'Miller', 'Medicare'],
        ['Emily', 'Wilson', 'Life Insurance'],
      ]
      leadsNames.forEach(([first, last, service], index) => {
        opportunities.push(
          createOpportunity(
            `lead-${index + 1}`,
            first,
            last,
            service,
            PipelineStage.LEADS_INTEREST,
            index % 2 === 0 ? 'HOT' : 'WARM',
            3000 + index * 1000
          )
        )
      })

      // 5 cards in PROSPECT_QUOTE
      const quoteNames = [
        ['Robert', 'Moore', 'Life Insurance'],
        ['Jennifer', 'Taylor', 'Annuity'],
        ['William', 'Anderson', 'Health Insurance'],
        ['Jessica', 'Thomas', 'Medicare'],
        ['James', 'Jackson', 'Life Insurance'],
      ]
      quoteNames.forEach(([first, last, service], index) => {
        opportunities.push(
          createOpportunity(
            `quote-${index + 1}`,
            first,
            last,
            service,
            PipelineStage.PROSPECT_QUOTE,
            index % 3 === 0 ? 'HOT' : index % 3 === 1 ? 'WARM' : 'COLD',
            4000 + index * 800
          )
        )
      })

      // 5 cards in PROSPECT_APP_SIGNED
      const appSignedNames = [
        ['Christopher', 'White', 'Life Insurance'],
        ['Amanda', 'Harris', 'Annuity'],
        ['Daniel', 'Martin', 'Health Insurance'],
        ['Melissa', 'Thompson', 'Medicare'],
        ['Matthew', 'Garcia', 'Life Insurance'],
      ]
      appSignedNames.forEach(([first, last, service], index) => {
        opportunities.push(
          createOpportunity(
            `app-${index + 1}`,
            first,
            last,
            service,
            PipelineStage.PROSPECT_APP_SIGNED,
            'HOT',
            5000 + index * 1000
          )
        )
      })

      // 5 cards in PROSPECT_UNDERWRITING
      const underwritingNames = [
        ['Andrew', 'Martinez', 'Life Insurance'],
        ['Michelle', 'Robinson', 'Annuity'],
        ['Joshua', 'Clark', 'Health Insurance'],
        ['Stephanie', 'Rodriguez', 'Medicare'],
        ['Kevin', 'Lewis', 'Life Insurance'],
      ]
      underwritingNames.forEach(([first, last, service], index) => {
        opportunities.push(
          createOpportunity(
            `under-${index + 1}`,
            first,
            last,
            service,
            PipelineStage.PROSPECT_UNDERWRITING,
            'HOT',
            6000 + index * 1200
          )
        )
      })

      // 3 cards in CLIENT_WON_IN_FORCE
      const wonNames = [
        ['Brian', 'Lee', 'Life Insurance'],
        ['Nicole', 'Walker', 'Annuity'],
        ['Ryan', 'Hall', 'Health Insurance'],
      ]
      wonNames.forEach(([first, last, service], index) => {
        opportunities.push(
          createOpportunity(
            `won-${index + 1}`,
            first,
            last,
            service,
            PipelineStage.CLIENT_WON_IN_FORCE,
            'HOT',
            7000 + index * 1500
          )
        )
      })

      // 2 cards in LOST_LOST
      const lostNames = [
        ['Thomas', 'Allen', 'Life Insurance'],
        ['Laura', 'Young', 'Annuity'],
      ]
      lostNames.forEach(([first, last, service], index) => {
        opportunities.push(
          createOpportunity(
            `lost-${index + 1}`,
            first,
            last,
            service,
            PipelineStage.LOST_LOST,
            'COLD',
            2000 + index * 500
          )
        )
      })

      resolve(opportunities)
    }, 500)
  })
}

/**
 * Update opportunity
 */
export async function updateOpportunity(
  id: string,
  data: UpdateOpportunityDto
): Promise<Opportunity> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: data.name || 'Updated Opportunity',
        service: data.service || null,
        createDate: new Date().toISOString(),
        pipelineStage: data.pipelineStage || PipelineStage.LEADS_INTEREST,
        temperature: data.temperature || null,
        estAnnualPremium: data.estAnnualPremium || null,
        opportunityAmount: data.opportunityAmount || null,
        contactId: '1',
        agentId: '1',
        isLocked: false,
        contact: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }, 300)
  })
}

/**
 * Update opportunity stage (for drag and drop)
 */
export async function updateOpportunityStage(
  id: string,
  stage: PipelineStage
): Promise<Opportunity> {
  return updateOpportunity(id, { pipelineStage: stage })
}


