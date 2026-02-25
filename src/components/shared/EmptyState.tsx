import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      {Icon && (
        <Icon className="w-12 h-12 text-zinc-600 mb-4" strokeWidth={1.5} />
      )}
      <h3 className="text-lg font-medium text-zinc-400 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-500 max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  )
}
