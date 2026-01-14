import { useDroppable } from '@dnd-kit/core'
import { OpportunityCard } from '../OpportunityCard/OpportunityCard'
import {
  Opportunity,
  PipelineStage,
  STAGE_CONFIGS,
  PipelineCategory,
  CATEGORY_COLORS,
} from '@/types/opportunity'

type StageColumnProps = {
  stage: PipelineStage
  opportunities: Opportunity[]
  onOpportunityClick?: (opportunity: Opportunity) => void
  categoryId?: PipelineCategory
  categoryLabel?: string // For mobile view: show category above column header
}

export function StageColumn({
  stage,
  opportunities,
  onOpportunityClick,
  categoryId,
  categoryLabel,
}: StageColumnProps) {
  const config = STAGE_CONFIGS[stage]
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  })

  // Get category colors if categoryId is provided
  const categoryColors = categoryId ? CATEGORY_COLORS[categoryId] : null
  // Header background should match the badge background color
  const headerBgClass = config.bgColor
  const headerBorderClass = categoryColors
    ? `${categoryColors.separatorBorder} ${categoryColors.separatorBorderDark}`
    : 'border-neutral-200 dark:border-slate-700'
  // Column container should match category container background in dark mode
  // In dark mode, use transparent so category background shows through
  const containerBgClass = categoryColors
    ? `${categoryColors.containerBg} dark:bg-transparent`
    : 'bg-white dark:bg-surface-dark'
  const headerTextColor = categoryColors
    ? categoryColors.labelColor
    : 'text-text-main dark:text-white'
  // Column border should match category color
  const columnBorderClass = categoryColors
    ? `${categoryColors.borderColor} ${categoryColors.borderColorDark}`
    : 'border-neutral-200 dark:border-slate-700'

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 flex flex-col ${categoryLabel ? '' : `border ${columnBorderClass} rounded-lg`} ${containerBgClass} ${
        isOver ? 'bg-primary/5 border-primary' : ''
      }`}
    >
      {/* Category Label - Above column header (mobile only) */}
      {categoryLabel && categoryColors && (
        <div className="mb-1 md:hidden">
          <h2 className={`text-base font-bold text-center ${categoryColors.labelColor} pb-3`}>
            {categoryLabel}
          </h2>
        </div>
      )}

      {/* Column Container - Only has border when there's no category label above */}
      <div className={`flex flex-col ${categoryLabel ? `border ${columnBorderClass} rounded-lg` : ''}`}>
        {/* Column Header - Background matches badge color */}
        <div className={`pb-3 border-b ${headerBorderClass} ${headerBgClass} px-3 pt-3 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-base font-semibold ${headerTextColor}`}>{config.label}</h2>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bgColor} ${config.color}`}
            >
              {opportunities.length}
            </span>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="flex-1 space-y-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-300px)] p-3 stage-column-scrollbar">
          {opportunities.length === 0 ? (
            <div
              className={`flex items-center justify-center h-32 rounded-lg border-2 border-dashed ${
                categoryColors
                  ? `${categoryColors.cardBorder} ${categoryColors.cardBorderDark}`
                  : 'border-neutral-200 dark:border-slate-700'
              }`}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">No opportunities</p>
            </div>
          ) : (
            opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onClick={() => onOpportunityClick?.(opportunity)}
                categoryId={categoryId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

