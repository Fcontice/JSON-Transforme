import { AlertCircle, X } from 'lucide-react'
import type { JsonValidationError } from '../../types'

interface ErrorBannerProps {
  error: JsonValidationError
  onDismiss?: () => void
}

export default function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-error-500/10 border border-error-500/30 rounded-md">
      <AlertCircle className="w-5 h-5 text-error-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-error-400">JSON Parse Error</p>
        <p className="text-sm text-zinc-400 mt-0.5">
          {error.message}
        </p>
        <p className="text-xs text-zinc-500 font-mono mt-1">
          Line {error.line}, Column {error.column}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded hover:bg-zinc-700/50 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-zinc-500" />
        </button>
      )}
    </div>
  )
}
