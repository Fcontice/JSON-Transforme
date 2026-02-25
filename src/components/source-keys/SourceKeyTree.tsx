import { useMemo } from 'react'
import { useSourceKeysStore } from '../../store'
import SourceKeyNode from './SourceKeyNode'
import type { SourceKey } from '../../types'

export default function SourceKeyTree() {
  const { keys, searchQuery, expandedPaths } = useSourceKeysStore()
  const filteredKeys = useSourceKeysStore(state => state.filteredKeys())

  // Build a tree structure from flat keys
  const rootKeys = useMemo(() => {
    // If searching, show flat filtered results
    if (searchQuery) {
      return filteredKeys
    }

    // Otherwise, build tree starting from top-level keys
    return keys.filter(key => !key.parentPath || key.depth === 1)
  }, [keys, filteredKeys, searchQuery])

  // Get children of a given path
  const getChildren = (parentPath: string): SourceKey[] => {
    if (searchQuery) return [] // Flat view when searching
    return keys.filter(key => key.parentPath === parentPath)
  }

  // Check if a key has children
  const hasChildren = (key: SourceKey): boolean => {
    if (searchQuery) return false
    return keys.some(k => k.parentPath === key.path)
  }

  if (rootKeys.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-zinc-500">
        No keys match your search
      </div>
    )
  }

  return (
    <div className="p-2">
      {rootKeys.map(key => (
        <SourceKeyNode
          key={key.id}
          keyData={key}
          hasChildren={hasChildren(key)}
          isExpanded={expandedPaths.has(key.path)}
          getChildren={getChildren}
          depth={searchQuery ? 0 : 0}
        />
      ))}
    </div>
  )
}
