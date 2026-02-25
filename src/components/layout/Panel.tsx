import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  title?: string
  headerContent?: ReactNode
  className?: string
}

export default function Panel({ children, title, headerContent, className = '' }: PanelProps) {
  return (
    <div className={`flex flex-col h-full bg-zinc-900 ${className}`}>
      {(title || headerContent) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 shrink-0">
          {title && (
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
              {title}
            </h2>
          )}
          {headerContent}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
