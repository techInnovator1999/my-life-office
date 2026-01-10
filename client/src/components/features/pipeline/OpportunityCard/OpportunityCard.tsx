import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Opportunity, Temperature, PipelineCategory, CATEGORY_COLORS } from '@/types/opportunity'

type OpportunityCardProps = {
  opportunity: Opportunity
  onClick?: () => void
  categoryId?: PipelineCategory
}

const temperatureIcons: Record<Temperature, string> = {
  HOT: 'local_fire_department',
  WARM: 'wb_sunny',
  COLD: 'ac_unit',
  UNKNOWN: 'help',
}

const temperatureColors: Record<Temperature, string> = {
  HOT: 'text-red-600 dark:text-red-400',
  WARM: 'text-orange-600 dark:text-orange-400',
  COLD: 'text-blue-600 dark:text-blue-400',
  UNKNOWN: 'text-gray-600 dark:text-gray-400',
}

export function OpportunityCard({ opportunity, onClick, categoryId }: OpportunityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opportunity.id,
    disabled: opportunity.isLocked, // Disable dragging if locked
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const contactName = opportunity.contact
    ? `${opportunity.contact.firstName} ${opportunity.contact.lastName}`
    : 'Unknown Contact'

  const temperature = opportunity.temperature || Temperature.UNKNOWN
  const temperatureColor = temperatureColors[temperature]

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Apply category-colored borders
  const categoryColors = categoryId ? CATEGORY_COLORS[categoryId] : null
  const borderClass = categoryColors
    ? `${categoryColors.cardBorder} ${categoryColors.cardBorderDark}`
    : 'border-neutral-200 dark:border-slate-700'
  const separationLineClass = categoryColors
    ? `${categoryColors.cardBorder} ${categoryColors.cardBorderDark}`
    : 'border-neutral-200 dark:border-slate-700'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm border ${borderClass} hover:shadow-md transition-colors group ${
        opportunity.isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Header: Name and Temperature */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-main dark:text-white line-clamp-2 flex-1 pr-2">
          {opportunity.name}
        </h3>
        {opportunity.temperature && (
          <span
            className={`flex-shrink-0 ${temperatureColors[temperature]}`}
            title={temperature}
          >
            <span className="material-symbols-outlined text-[20px]">
              {temperatureIcons[temperature]}
            </span>
          </span>
        )}
      </div>

      {/* Contact Info */}
      {opportunity.contact && (
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[16px] text-gray-600 dark:text-gray-400">
            person
          </span>
          <span className="text-xs text-gray-800 dark:text-gray-200 truncate font-medium">
            {contactName}
          </span>
        </div>
      )}

      {/* Service */}
      {opportunity.service && (
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[16px] text-gray-600 dark:text-gray-400">
            category
          </span>
          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">{opportunity.service}</span>
        </div>
      )}

      {/* Amount */}
      {opportunity.opportunityAmount && (
        <div className={`flex items-center justify-between pt-3 border-t ${separationLineClass}`}>
          <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Amount</span>
          <span className="text-sm font-semibold text-primary">
            {formatCurrency(opportunity.opportunityAmount)}
          </span>
        </div>
      )}

      {/* Locked Indicator */}
      {opportunity.isLocked && (
        <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <span>Locked</span>
        </div>
      )}
    </div>
  )
}

