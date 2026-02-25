import { useState, useRef, useEffect, useMemo } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import {
  GripVertical,
  ChevronRight,
  ChevronDown,
  Braces,
  List,
  ArrowRight,
  Type,
} from 'lucide-react'
import { useTargetStore, useUiStore, useSourceKeysStore, useInputStore } from '../../store'
import { getValueAtPath } from '../../lib/keyExtractor'
import TransformDropdown from './TransformDropdown'
import DropIndicator from './DropIndicator'
import type { TargetNode as TargetNodeType } from '../../types'

interface TargetNodeProps {
  node: TargetNodeType
  depth: number
  index: number
  parentId: string | null
}

export default function TargetNode({ node, depth, index, parentId }: TargetNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(node.targetKey)
  const inputRef = useRef<HTMLInputElement>(null)

  const { updateNode } = useTargetStore()
  const { openContextMenu, editingNodeId, setEditingNodeId } = useUiStore()
  const { parsedData, isArray } = useInputStore()
  useSourceKeysStore() // Hook for reactivity

  // Get the actual value from the source JSON data
  const sourceValue = useMemo(() => {
    if (!node.sourceKeyPath || !parsedData) return undefined

    // For arrays, use the first record to preview
    const data = isArray ? (parsedData as unknown[])[0] : parsedData
    return getValueAtPath(data, node.sourceKeyPath)
  }, [node.sourceKeyPath, parsedData, isArray])

  // Format the value for display
  const formatValue = (value: unknown): string => {
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'
    if (typeof value === 'string') {
      // Truncate long strings
      const truncated = value.length > 30 ? value.slice(0, 30) + '...' : value
      return `"${truncated}"`
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return `[${value.length} items]`
      }
      return '{...}'
    }
    return String(value)
  }

  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: `target-${node.id}`,
    data: {
      type: 'target-node',
      node,
      parentId,
      index,
    },
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `target-drop-${node.id}`,
    data: {
      type: 'target-drop',
      node,
      parentId,
      accepts: ['object', 'array'].includes(node.type) ? ['source-key', 'target-node'] : [],
    },
  })

  // Handle editing state from UI store
  useEffect(() => {
    if (editingNodeId === node.id) {
      setIsEditing(true)
      setEditValue(node.targetKey)
    }
  }, [editingNodeId, node.id, node.targetKey])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditValue(node.targetKey)
    setEditingNodeId(node.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleSave = () => {
    if (editValue.trim()) {
      updateNode(node.id, { targetKey: editValue.trim() })
    }
    setIsEditing(false)
    setEditingNodeId(null)
  }

  const handleCancel = () => {
    setEditValue(node.targetKey)
    setIsEditing(false)
    setEditingNodeId(null)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    openContextMenu(node.id, { x: e.clientX, y: e.clientY })
  }

  const canHaveChildren = node.type === 'object' || node.type === 'array'
  const hasChildren = node.children.length > 0

  const getIcon = () => {
    switch (node.type) {
      case 'object':
        return <Braces className="w-3.5 h-3.5 text-orange-400" />
      case 'array':
        return <List className="w-3.5 h-3.5 text-purple-400" />
      case 'field':
        return <ArrowRight className="w-3.5 h-3.5 text-accent-400" />
      case 'literal':
        return <Type className="w-3.5 h-3.5 text-green-400" />
    }
  }

  return (
    <div className={isDragging ? 'opacity-50' : ''}>
      {/* Drop indicator above */}
      <DropIndicator parentId={parentId} index={index} />

      <div
        ref={(el) => {
          setDragRef(el)
          setDropRef(el)
        }}
        onContextMenu={handleContextMenu}
        className={`
          group flex items-center gap-1 py-1.5 px-2 rounded
          transition-all select-none
          ${isOver && canHaveChildren ? 'bg-accent-500/10 ring-1 ring-accent-500/30' : 'hover:bg-zinc-800/70'}
        `}
        style={{ marginLeft: `${depth * 16}px` }}
      >
        {/* Expand/Collapse toggle */}
        {canHaveChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 rounded hover:bg-zinc-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>
        ) : (
          <span className="w-4.5" />
        )}

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="p-0.5 rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-3.5 h-3.5 text-zinc-600" />
        </div>

        {/* Type icon */}
        {getIcon()}

        {/* Target key name */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-1 px-1 py-0.5 text-sm font-mono bg-zinc-800 border border-accent-500 rounded
                       text-zinc-200 focus:outline-none min-w-0"
          />
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            className="text-sm font-mono text-zinc-200 cursor-text truncate"
            title="Double-click to rename"
          >
            {node.targetKey}
          </span>
        )}

        {/* Source value indicator */}
        {node.sourceKeyPath && (
          <span
            className="text-xs font-mono text-emerald-400/80 truncate max-w-48"
            title={`${node.sourceKeyPath}: ${formatValue(sourceValue)}`}
          >
            = {formatValue(sourceValue)}
          </span>
        )}

        {/* Literal value indicator */}
        {node.type === 'literal' && node.literalValue !== undefined && (
          <span className="text-xs font-mono text-green-400/70 truncate max-w-32">
            = {JSON.stringify(node.literalValue)}
          </span>
        )}

        {/* Transform dropdown for fields */}
        {node.type === 'field' && (
          <TransformDropdown nodeId={node.id} transform={node.transform} transformArg={node.transformArg} />
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child, childIndex) => (
            <TargetNode
              key={child.id}
              node={child}
              depth={depth + 1}
              index={childIndex}
              parentId={node.id}
            />
          ))}
          {/* Drop indicator at end of children */}
          <DropIndicator parentId={node.id} index={node.children.length} />
        </div>
      )}
    </div>
  )
}
