import { useDraggable } from '@dnd-kit/core'
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react'
import { useSourceKeysStore } from '../../store'
import TypeBadge from './TypeBadge'
import type { SourceKey } from '../../types'

interface SourceKeyNodeProps {
  keyData: SourceKey
  hasChildren: boolean
  isExpanded: boolean
  getChildren: (parentPath: string) => SourceKey[]
  depth: number
}

export default function SourceKeyNode({
  keyData,
  hasChildren,
  isExpanded,
  getChildren,
  depth,
}: SourceKeyNodeProps) {
  const { toggleExpanded, expandedPaths, mappedPaths } = useSourceKeysStore()

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `source-${keyData.id}`,
    data: {
      type: 'source-key',
      keyData,
    },
  })

  const isMapped = mappedPaths.has(keyData.path)
  const children = isExpanded ? getChildren(keyData.path) : []

  // Get the last part of the path for display
  const displayName = keyData.path.includes('.')
    ? keyData.path.split('.').pop() || keyData.path
    : keyData.path.replace('[]', '')

  // Check if this node itself represents an array path
  const isArrayPath = keyData.path.includes('[]')

  return (
    <div>
      <div
        ref={setNodeRef}
        className={`
          group flex items-center gap-1 py-1 px-1 rounded cursor-grab
          transition-all select-none
          ${isDragging ? 'opacity-50' : ''}
          ${isMapped ? 'opacity-50' : 'hover:bg-zinc-800/70'}
        `}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {/* Expand/Collapse toggle */}
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(keyData.path)}
            className="p-0.5 rounded hover:bg-zinc-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>
        ) : (
          <span className="w-4.5" /> // Spacer for alignment
        )}

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="p-0.5 rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-3.5 h-3.5 text-zinc-600" />
        </div>

        {/* Key name */}
        <span
          className={`
            font-mono text-sm truncate
            ${isArrayPath ? 'text-accent-400' : 'text-zinc-200'}
          `}
          title={keyData.path}
        >
          {displayName}
          {isArrayPath && !displayName.includes('[]') && (
            <span className="text-accent-400/60">[]</span>
          )}
        </span>

        {/* Type badge */}
        <TypeBadge type={keyData.type} />

        {/* Occurrence count */}
        <span className="text-xs text-zinc-600 font-mono ml-auto">
          {keyData.occurrences}
        </span>
      </div>

      {/* Children */}
      {isExpanded &&
        children.map(child => (
          <SourceKeyNode
            key={child.id}
            keyData={child}
            hasChildren={getChildren(child.path).length > 0}
            isExpanded={expandedPaths.has(child.path)}
            getChildren={getChildren}
            depth={depth + 1}
          />
        ))}
    </div>
  )
}
