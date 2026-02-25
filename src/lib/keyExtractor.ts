import { nanoid } from 'nanoid'
import type { DataType, SourceKey } from '../types'

interface KeyInfo {
  path: string
  type: DataType
  occurrences: number
  samples: unknown[]
  depth: number
  parentPath: string | null
  isArray: boolean
}

export function extractKeys(data: unknown): SourceKey[] {
  const keyMap = new Map<string, KeyInfo>()

  // Handle both single objects and arrays of objects
  const records = Array.isArray(data) ? data : [data]

  for (const record of records) {
    extractKeysRecursive(record, '', keyMap, 0, null, false)
  }

  // Convert map to array and build tree structure
  const keys = Array.from(keyMap.values()).map((info): SourceKey => ({
    id: nanoid(),
    path: info.path,
    type: info.type,
    occurrences: info.occurrences,
    sample: info.samples[0],
    depth: info.depth,
    parentPath: info.parentPath,
    isArray: info.isArray,
    children: [],
  }))

  // Build parent-child relationships
  const keysByPath = new Map(keys.map(k => [k.path, k]))

  for (const key of keys) {
    if (key.parentPath) {
      const parent = keysByPath.get(key.parentPath)
      if (parent) {
        parent.children.push(key.id)
      }
    }
  }

  // Sort by path for consistent ordering
  keys.sort((a, b) => {
    const aParts = a.path.split(/[.\[\]]/).filter(Boolean)
    const bParts = b.path.split(/[.\[\]]/).filter(Boolean)

    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      const cmp = (aParts[i] ?? '').localeCompare(bParts[i] ?? '')
      if (cmp !== 0) return cmp
    }

    return aParts.length - bParts.length
  })

  return keys
}

function extractKeysRecursive(
  value: unknown,
  currentPath: string,
  keyMap: Map<string, KeyInfo>,
  depth: number,
  parentPath: string | null,
  isInArray: boolean
): void {
  if (value === null || value === undefined) {
    if (currentPath) {
      updateKeyInfo(keyMap, currentPath, 'null', null, depth, parentPath, isInArray)
    }
    return
  }

  const type = getDataType(value)

  if (type === 'array') {
    const arr = value as unknown[]

    if (currentPath) {
      updateKeyInfo(keyMap, currentPath, 'array', value, depth, parentPath, isInArray)
    }

    // Use bracket notation for array items
    const arrayPath = currentPath ? `${currentPath}[]` : '[]'

    if (arr.length > 0) {
      // Extract keys from all array items to capture all possible keys
      for (const item of arr) {
        extractKeysRecursive(item, arrayPath, keyMap, depth + 1, currentPath || null, true)
      }
    }
  } else if (type === 'object') {
    const obj = value as Record<string, unknown>

    if (currentPath) {
      updateKeyInfo(keyMap, currentPath, 'object', value, depth, parentPath, isInArray)
    }

    for (const [key, val] of Object.entries(obj)) {
      const newPath = currentPath ? `${currentPath}.${key}` : key
      extractKeysRecursive(val, newPath, keyMap, depth + 1, currentPath || null, isInArray)
    }
  } else {
    if (currentPath) {
      updateKeyInfo(keyMap, currentPath, type, value, depth, parentPath, isInArray)
    }
  }
}

function updateKeyInfo(
  keyMap: Map<string, KeyInfo>,
  path: string,
  type: DataType,
  sample: unknown,
  depth: number,
  parentPath: string | null,
  isArray: boolean
): void {
  const existing = keyMap.get(path)

  if (existing) {
    existing.occurrences++

    // Track type changes (mixed)
    if (existing.type !== type && existing.type !== 'mixed') {
      existing.type = 'mixed'
    }

    // Keep first few samples for reference
    if (existing.samples.length < 3 && sample !== undefined) {
      existing.samples.push(sample)
    }
  } else {
    keyMap.set(path, {
      path,
      type,
      occurrences: 1,
      samples: sample !== undefined ? [sample] : [],
      depth,
      parentPath,
      isArray,
    })
  }
}

function getDataType(value: unknown): DataType {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'

  const type = typeof value

  switch (type) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'object':
      return 'object'
    default:
      return 'null'
  }
}

export function getValueAtPath(data: unknown, path: string): unknown {
  if (!path) return data

  const parts = parsePath(path)
  let current: unknown = data

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined
    }

    if (part === '[]') {
      // Array notation - return first element or the array itself
      if (Array.isArray(current) && current.length > 0) {
        current = current[0]
      } else {
        return undefined
      }
    } else if (Array.isArray(current)) {
      // Try to access array by index
      const idx = parseInt(part, 10)
      if (!isNaN(idx)) {
        current = current[idx]
      } else {
        return undefined
      }
    } else if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }

  return current
}

function parsePath(path: string): string[] {
  const parts: string[] = []
  let current = ''

  for (let i = 0; i < path.length; i++) {
    const char = path[i]!

    if (char === '.') {
      if (current) {
        parts.push(current)
        current = ''
      }
    } else if (char === '[') {
      if (current) {
        parts.push(current)
        current = ''
      }
      // Find closing bracket
      const closeIdx = path.indexOf(']', i)
      if (closeIdx !== -1) {
        const content = path.slice(i + 1, closeIdx)
        parts.push(content || '[]')
        i = closeIdx
      }
    } else if (char !== ']') {
      current += char
    }
  }

  if (current) {
    parts.push(current)
  }

  return parts
}

export function filterKeys(keys: SourceKey[], query: string): SourceKey[] {
  if (!query.trim()) return keys

  const lowerQuery = query.toLowerCase()

  return keys.filter(key => key.path.toLowerCase().includes(lowerQuery))
}

export function getTopLevelKeys(keys: SourceKey[]): SourceKey[] {
  return keys.filter(key => key.depth === 1 && !key.parentPath)
}

export function getChildKeys(keys: SourceKey[], parentPath: string): SourceKey[] {
  return keys.filter(key => key.parentPath === parentPath)
}
