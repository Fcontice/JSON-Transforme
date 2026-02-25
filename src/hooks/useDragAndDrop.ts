import { useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { useTargetStore, useSourceKeysStore, useUiStore } from '../store'
import type { SourceKey, TargetNode } from '../types'

export function useDragAndDrop() {
  const { addFieldFromSource, moveNode } = useTargetStore()
  const { markAsMapped } = useSourceKeysStore()
  const { setDraggedItemId } = useUiStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedItemId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedItemId(null)

    const { active, over } = event

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (!activeData || !overData) return

    // Handle source key drop
    if (activeData.type === 'source-key') {
      const sourceKey = activeData.keyData as SourceKey

      // Determine where to drop
      if (overData.type === 'target-root') {
        // Drop at root level
        const targetKey = getKeyName(sourceKey.path)
        addFieldFromSource(sourceKey.path, targetKey)
        markAsMapped(sourceKey.path)
      } else if (overData.type === 'target-drop') {
        // Drop into a specific container or position
        const parentNode = overData.node as TargetNode | undefined
        const parentId = parentNode?.id ?? null

        if (parentNode && (parentNode.type === 'object' || parentNode.type === 'array')) {
          const targetKey = getKeyName(sourceKey.path)
          addFieldFromSource(sourceKey.path, targetKey, parentId ?? undefined)
          markAsMapped(sourceKey.path)
        }
      } else if (overData.type === 'drop-indicator') {
        // Drop at a specific index
        const { parentId, index } = overData as { parentId: string | null; index: number }
        const targetKey = getKeyName(sourceKey.path)
        addFieldFromSource(sourceKey.path, targetKey, parentId === null ? undefined : parentId, index)
        markAsMapped(sourceKey.path)
      }
    }

    // Handle target node reorder
    if (activeData.type === 'target-node' && overData.type === 'drop-indicator') {
      const movingNode = activeData.node as TargetNode
      const { parentId, index } = overData as { parentId: string | null; index: number }

      // Don't move node into itself or its children
      if (!isDescendant(movingNode, parentId)) {
        moveNode(movingNode.id, parentId, index)
      }
    }
  }

  const handleDragOver = (_event: DragOverEvent) => {
    // Can be used for real-time preview of drop position
  }

  return {
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  }
}

function getKeyName(path: string): string {
  // Extract the last part of the path as the target key name
  const parts = path.split(/[.\[\]]/).filter(Boolean)
  return parts[parts.length - 1] ?? path
}

function isDescendant(node: TargetNode, potentialDescendantId: string | null): boolean {
  if (!potentialDescendantId) return false
  if (node.id === potentialDescendantId) return true

  for (const child of node.children) {
    if (isDescendant(child, potentialDescendantId)) {
      return true
    }
  }

  return false
}
