import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  Opportunity,
  PipelineStage,
  STAGE_ORDER,
  CATEGORY_CONFIGS,
  PipelineCategory,
  CATEGORY_COLORS,
} from '@/types/opportunity'
import { StageColumn } from '../StageColumn/StageColumn'
import { OpportunityCard } from '../OpportunityCard/OpportunityCard'
import { updateOpportunityStage } from '@/services/opportunityService'

type KanbanBoardProps = {
  opportunities: Opportunity[]
  onOpportunityClick?: (opportunity: Opportunity) => void
  onOpportunityMove?: (opportunityId: string, newStage: PipelineStage) => void
}

export function KanbanBoard({
  opportunities,
  onOpportunityClick,
  onOpportunityMove,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [groupedOpportunities, setGroupedOpportunities] = useState<
    Record<PipelineStage, Opportunity[]>
  >(() => {
    const grouped: Record<PipelineStage, Opportunity[]> = {
      [PipelineStage.LEADS_INTEREST]: [],
      [PipelineStage.PROSPECT_QUOTE]: [],
      [PipelineStage.PROSPECT_APP_SIGNED]: [],
      [PipelineStage.PROSPECT_UNDERWRITING]: [],
      [PipelineStage.CLIENT_WON_IN_FORCE]: [],
      [PipelineStage.LOST_LOST]: [],
    }
    return grouped
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Group opportunities by stage
  useEffect(() => {
    const grouped: Record<PipelineStage, Opportunity[]> = {
      [PipelineStage.LEADS_INTEREST]: [],
      [PipelineStage.PROSPECT_QUOTE]: [],
      [PipelineStage.PROSPECT_APP_SIGNED]: [],
      [PipelineStage.PROSPECT_UNDERWRITING]: [],
      [PipelineStage.CLIENT_WON_IN_FORCE]: [],
      [PipelineStage.LOST_LOST]: [],
    }

    opportunities.forEach((opp) => {
      grouped[opp.pipelineStage].push(opp)
    })

    setGroupedOpportunities(grouped)
  }, [opportunities])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) return

    const opportunityId = active.id as string
    const newStage = over.id as PipelineStage

    // Check if dropped on a valid stage
    if (!Object.values(PipelineStage).includes(newStage)) return

    // Find the opportunity
    const opportunity = opportunities.find((opp) => opp.id === opportunityId)
    if (!opportunity) return

    // Don't do anything if dropped on the same stage
    if (opportunity.pipelineStage === newStage) return

    // Don't allow moving locked opportunities
    if (opportunity.isLocked) return

    // Optimistically update UI
    const updatedGrouped = { ...groupedOpportunities }
    updatedGrouped[opportunity.pipelineStage] = updatedGrouped[opportunity.pipelineStage].filter(
      (opp) => opp.id !== opportunityId
    )
    updatedGrouped[newStage] = [
      ...updatedGrouped[newStage],
      { ...opportunity, pipelineStage: newStage },
    ]
    setGroupedOpportunities(updatedGrouped)

    // Call callback if provided
    if (onOpportunityMove) {
      onOpportunityMove(opportunityId, newStage)
    }

    // Update in backend
    try {
      await updateOpportunityStage(opportunityId, newStage)
    } catch (error) {
      // Revert on error - reload from opportunities prop
      const revertedGrouped: Record<PipelineStage, Opportunity[]> = {
        [PipelineStage.LEADS_INTEREST]: [],
        [PipelineStage.PROSPECT_QUOTE]: [],
        [PipelineStage.PROSPECT_APP_SIGNED]: [],
        [PipelineStage.PROSPECT_UNDERWRITING]: [],
        [PipelineStage.CLIENT_WON_IN_FORCE]: [],
        [PipelineStage.LOST_LOST]: [],
      }
      opportunities.forEach((opp) => {
        revertedGrouped[opp.pipelineStage].push(opp)
      })
      setGroupedOpportunities(revertedGrouped)
      console.error('Failed to update opportunity stage:', error)
    }
  }

  const activeOpportunity = activeId
    ? opportunities.find((opp) => opp.id === activeId)
    : null

  // Find category for active opportunity
  const getCategoryForStage = (stage: PipelineStage): PipelineCategory | undefined => {
    for (const category of CATEGORY_CONFIGS) {
      if (category.stages.includes(stage)) {
        return category.id as PipelineCategory
      }
    }
    return undefined
  }

  const activeCategoryId = activeOpportunity
    ? getCategoryForStage(activeOpportunity.pipelineStage)
    : undefined

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 pipeline-scrollbar">
        {CATEGORY_CONFIGS.map((category) => {
          const categoryColors = CATEGORY_COLORS[category.id as PipelineCategory]
          const categoryBgClass = `${categoryColors.containerBg} ${categoryColors.containerBgDark}`
          const categoryBorderClass = `${categoryColors.borderColor} ${categoryColors.borderColorDark}`
          const separatorBorderClass = `${categoryColors.separatorBorder} ${categoryColors.separatorBorderDark}`

          return (
            <div
              key={category.id}
              className={`flex-shrink-0 flex gap-4 border-2 ${categoryBorderClass} rounded-xl p-4 ${categoryBgClass}`}
            >
              {/* Category Header - Vertical on left (desktop only, hidden on mobile) */}
              <div
                className={`hidden md:flex flex-shrink-0 w-20 items-center justify-center border-r ${separatorBorderClass} pr-4`}
              >
                <h2
                  className={`text-base font-bold transform -rotate-90 whitespace-nowrap ${categoryColors.labelColor}`}
                >
                  {category.label}
                </h2>
              </div>

              {/* Stages in this category */}
              <div className="flex gap-4 flex-1">
                {category.stages.map((stage) => (
                  <SortableContext
                    key={stage}
                    id={stage}
                    items={groupedOpportunities[stage].map((opp) => opp.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <StageColumn
                      stage={stage}
                      opportunities={groupedOpportunities[stage]}
                      onOpportunityClick={onOpportunityClick}
                      categoryId={category.id as PipelineCategory}
                      categoryLabel={category.label}
                    />
                  </SortableContext>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <DragOverlay>
        {activeOpportunity ? (
          <div className="opacity-90 rotate-3">
            <OpportunityCard opportunity={activeOpportunity} categoryId={activeCategoryId} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

