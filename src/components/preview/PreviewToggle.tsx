import { useUiStore } from '../../store'
import type { ViewMode } from '../../types'

export default function PreviewToggle() {
  const { viewMode, setViewMode } = useUiStore()

  const options: { value: ViewMode; label: string }[] = [
    { value: 'schema', label: 'Schema' },
    { value: 'data', label: 'Data' },
  ]

  return (
    <div className="flex rounded-md bg-zinc-800 p-0.5">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => setViewMode(option.value)}
          className={`
            px-2 py-0.5 text-xs font-medium rounded transition-colors
            ${
              viewMode === option.value
                ? 'bg-zinc-700 text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-300'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
