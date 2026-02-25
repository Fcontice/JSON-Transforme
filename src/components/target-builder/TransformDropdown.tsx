import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Wand2 } from 'lucide-react'
import { useTargetStore } from '../../store'
import { transformOptions, getTransformLabel } from '../../lib/valueTransforms'
import type { TransformType } from '../../types'

interface TransformDropdownProps {
  nodeId: string
  transform?: TransformType
  transformArg?: unknown
}

export default function TransformDropdown({
  nodeId,
  transform = 'none',
  transformArg,
}: TransformDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showArgInput, setShowArgInput] = useState(false)
  const [argValue, setArgValue] = useState(String(transformArg ?? ''))
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { setTransform } = useTargetStore()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setShowArgInput(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value: TransformType) => {
    const option = transformOptions.find(o => o.value === value)

    if (option?.requiresArg) {
      setShowArgInput(true)
    } else {
      setTransform(nodeId, value)
      setIsOpen(false)
    }
  }

  const handleArgSubmit = () => {
    // Try to parse as JSON, fallback to string
    let parsedValue: unknown = argValue
    try {
      parsedValue = JSON.parse(argValue)
    } catch {
      parsedValue = argValue
    }

    setTransform(nodeId, 'default', parsedValue)
    setShowArgInput(false)
    setIsOpen(false)
  }

  if (transform === 'none') {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700 transition-all"
        title="Add transform"
      >
        <Wand2 className="w-3.5 h-3.5 text-zinc-500" />
      </button>
    )
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded
                   bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 transition-colors"
      >
        <span>{getTransformLabel(transform)}</span>
        {transform === 'default' && transformArg !== undefined && (
          <span className="text-accent-300/70">({String(transformArg)})</span>
        )}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-40 py-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl">
          {showArgInput ? (
            <div className="p-2">
              <label className="block text-xs text-zinc-400 mb-1">Default value:</label>
              <input
                type="text"
                value={argValue}
                onChange={(e) => setArgValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleArgSubmit()}
                placeholder="Enter value..."
                autoFocus
                className="w-full px-2 py-1 text-xs bg-zinc-900 border border-zinc-600 rounded
                           text-zinc-200 focus:outline-none focus:border-accent-500"
              />
              <div className="flex gap-1 mt-2">
                <button
                  onClick={handleArgSubmit}
                  className="flex-1 px-2 py-1 text-xs bg-accent-600 text-white rounded hover:bg-accent-500"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setShowArgInput(false)
                    setIsOpen(false)
                  }}
                  className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            transformOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-3 py-1.5 text-left text-sm hover:bg-zinc-700 transition-colors
                  ${option.value === transform ? 'text-accent-400 bg-accent-500/10' : 'text-zinc-300'}
                `}
              >
                <span className="font-medium">{option.label}</span>
                <span className="block text-xs text-zinc-500">{option.description}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
