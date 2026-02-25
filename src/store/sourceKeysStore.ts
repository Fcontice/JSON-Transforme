import { create } from 'zustand'
import type { SourceKey } from '../types'
import { filterKeys } from '../lib/keyExtractor'

interface SourceKeysState {
  keys: SourceKey[]
  searchQuery: string
  expandedPaths: Set<string>
  mappedPaths: Set<string>

  filteredKeys: () => SourceKey[]
  setKeys: (keys: SourceKey[]) => void
  setSearchQuery: (query: string) => void
  toggleExpanded: (path: string) => void
  expandAll: () => void
  collapseAll: () => void
  markAsMapped: (path: string) => void
  unmarkAsMapped: (path: string) => void
  getKeyByPath: (path: string) => SourceKey | undefined
}

export const useSourceKeysStore = create<SourceKeysState>((set, get) => ({
  keys: [],
  searchQuery: '',
  expandedPaths: new Set<string>(),
  mappedPaths: new Set<string>(),

  filteredKeys: () => {
    const { keys, searchQuery } = get()
    return filterKeys(keys, searchQuery)
  },

  setKeys: (keys: SourceKey[]) => {
    // Auto-expand first level
    const expanded = new Set<string>()
    for (const key of keys) {
      if (key.depth === 1) {
        expanded.add(key.path)
      }
    }

    set({
      keys,
      expandedPaths: expanded,
      mappedPaths: new Set(),
    })
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },

  toggleExpanded: (path: string) => {
    set(state => {
      const expanded = new Set(state.expandedPaths)
      if (expanded.has(path)) {
        expanded.delete(path)
      } else {
        expanded.add(path)
      }
      return { expandedPaths: expanded }
    })
  },

  expandAll: () => {
    set(state => {
      const expanded = new Set<string>()
      for (const key of state.keys) {
        if (key.type === 'object' || key.type === 'array') {
          expanded.add(key.path)
        }
      }
      return { expandedPaths: expanded }
    })
  },

  collapseAll: () => {
    set({ expandedPaths: new Set() })
  },

  markAsMapped: (path: string) => {
    set(state => {
      const mapped = new Set(state.mappedPaths)
      mapped.add(path)
      return { mappedPaths: mapped }
    })
  },

  unmarkAsMapped: (path: string) => {
    set(state => {
      const mapped = new Set(state.mappedPaths)
      mapped.delete(path)
      return { mappedPaths: mapped }
    })
  },

  getKeyByPath: (path: string) => {
    return get().keys.find(k => k.path === path)
  },
}))
