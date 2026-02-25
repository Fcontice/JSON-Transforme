import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type { TargetNode, TransformType } from '../types'

interface TargetState {
  nodes: TargetNode[]

  setNodes: (nodes: TargetNode[]) => void
  addNode: (node: Omit<TargetNode, 'id' | 'children'>, parentId?: string, index?: number) => string
  addFieldFromSource: (sourceKeyPath: string, targetKey: string, parentId?: string, index?: number) => string
  updateNode: (id: string, updates: Partial<Omit<TargetNode, 'id' | 'children'>>) => void
  deleteNode: (id: string) => void
  moveNode: (id: string, newParentId: string | null, newIndex: number) => void
  duplicateNode: (id: string) => string | null
  wrapInObject: (id: string) => void
  wrapInArray: (id: string) => void
  addSibling: (id: string, type: TargetNode['type']) => string | null
  setTransform: (id: string, transform: TransformType, arg?: unknown) => void
  clearAll: () => void
  findNode: (id: string) => TargetNode | undefined
  findParent: (id: string) => { parent: TargetNode | null; index: number }
  getNodePath: (id: string) => TargetNode[]
}

export const useTargetStore = create<TargetState>()(
  immer((set, get) => ({
    nodes: [],

    setNodes: (nodes) => {
      set({ nodes })
    },

    addNode: (nodeData, parentId, index) => {
      const id = nanoid()
      const newNode: TargetNode = {
        ...nodeData,
        id,
        children: [],
      }

      set(state => {
        if (parentId) {
          const parent = findNodeRecursive(state.nodes, parentId)
          if (parent) {
            if (index !== undefined && index >= 0 && index <= parent.children.length) {
              parent.children.splice(index, 0, newNode)
            } else {
              parent.children.push(newNode)
            }
          }
        } else {
          if (index !== undefined && index >= 0 && index <= state.nodes.length) {
            state.nodes.splice(index, 0, newNode)
          } else {
            state.nodes.push(newNode)
          }
        }
      })

      return id
    },

    addFieldFromSource: (sourceKeyPath, targetKey, parentId, index) => {
      return get().addNode(
        {
          type: 'field',
          targetKey,
          sourceKeyPath,
        },
        parentId,
        index
      )
    },

    updateNode: (id, updates) => {
      set(state => {
        const node = findNodeRecursive(state.nodes, id)
        if (node) {
          Object.assign(node, updates)
        }
      })
    },

    deleteNode: (id) => {
      set(state => {
        deleteNodeRecursive(state.nodes, id)
      })
    },

    moveNode: (id, newParentId, newIndex) => {
      set(state => {
        // Find and remove the node
        const node = findNodeRecursive(state.nodes, id)
        if (!node) return

        // Clone the node before removing (immer will handle this)
        const nodeCopy = JSON.parse(JSON.stringify(node)) as TargetNode

        // Remove from current location
        deleteNodeRecursive(state.nodes, id)

        // Add to new location
        if (newParentId) {
          const newParent = findNodeRecursive(state.nodes, newParentId)
          if (newParent) {
            const idx = Math.min(newIndex, newParent.children.length)
            newParent.children.splice(idx, 0, nodeCopy)
          }
        } else {
          const idx = Math.min(newIndex, state.nodes.length)
          state.nodes.splice(idx, 0, nodeCopy)
        }
      })
    },

    duplicateNode: (id) => {
      const state = get()
      const node = state.findNode(id)
      if (!node) return null

      const { parent, index } = state.findParent(id)

      const duplicated = deepCloneWithNewIds(node)

      set(state => {
        if (parent) {
          const p = findNodeRecursive(state.nodes, parent.id)
          if (p) {
            p.children.splice(index + 1, 0, duplicated)
          }
        } else {
          state.nodes.splice(index + 1, 0, duplicated)
        }
      })

      return duplicated.id
    },

    wrapInObject: (id) => {
      set(state => {
        const { parent, index } = findParentRecursive(state.nodes, id)
        const targetArray = parent ? parent.children : state.nodes
        const node = targetArray[index]

        if (node) {
          const wrapper: TargetNode = {
            id: nanoid(),
            type: 'object',
            targetKey: 'wrapped',
            children: [node],
          }
          targetArray[index] = wrapper
        }
      })
    },

    wrapInArray: (id) => {
      set(state => {
        const { parent, index } = findParentRecursive(state.nodes, id)
        const targetArray = parent ? parent.children : state.nodes
        const node = targetArray[index]

        if (node) {
          const wrapper: TargetNode = {
            id: nanoid(),
            type: 'array',
            targetKey: 'items',
            children: [node],
          }
          targetArray[index] = wrapper
        }
      })
    },

    addSibling: (id, type) => {
      const state = get()
      const { parent, index } = state.findParent(id)

      const newId = nanoid()
      const newNode: TargetNode = {
        id: newId,
        type,
        targetKey: type === 'object' ? 'newObject' : type === 'array' ? 'newArray' : 'newField',
        children: [],
      }

      set(state => {
        if (parent) {
          const p = findNodeRecursive(state.nodes, parent.id)
          if (p) {
            p.children.splice(index + 1, 0, newNode)
          }
        } else {
          state.nodes.splice(index + 1, 0, newNode)
        }
      })

      return newId
    },

    setTransform: (id, transform, arg) => {
      set(state => {
        const node = findNodeRecursive(state.nodes, id)
        if (node) {
          node.transform = transform
          node.transformArg = arg
        }
      })
    },

    clearAll: () => {
      set({ nodes: [] })
    },

    findNode: (id) => {
      return findNodeRecursive(get().nodes, id)
    },

    findParent: (id) => {
      const result = findParentRecursive(get().nodes, id)
      return {
        parent: result.parent,
        index: result.index,
      }
    },

    getNodePath: (id) => {
      const path: TargetNode[] = []
      findPathRecursive(get().nodes, id, path)
      return path
    },
  }))
)

function findNodeRecursive(nodes: TargetNode[], id: string): TargetNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNodeRecursive(node.children, id)
    if (found) return found
  }
  return undefined
}

function deleteNodeRecursive(nodes: TargetNode[], id: string): boolean {
  const index = nodes.findIndex(n => n.id === id)
  if (index !== -1) {
    nodes.splice(index, 1)
    return true
  }

  for (const node of nodes) {
    if (deleteNodeRecursive(node.children, id)) {
      return true
    }
  }

  return false
}

function findParentRecursive(
  nodes: TargetNode[],
  id: string,
  parent: TargetNode | null = null
): { parent: TargetNode | null; index: number } {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]!.id === id) {
      return { parent, index: i }
    }
    const result = findParentRecursive(nodes[i]!.children, id, nodes[i]!)
    if (result.index !== -1) {
      return result
    }
  }
  return { parent: null, index: -1 }
}

function findPathRecursive(nodes: TargetNode[], id: string, path: TargetNode[]): boolean {
  for (const node of nodes) {
    if (node.id === id) {
      path.push(node)
      return true
    }
    if (findPathRecursive(node.children, id, path)) {
      path.unshift(node)
      return true
    }
  }
  return false
}

function deepCloneWithNewIds(node: TargetNode): TargetNode {
  return {
    ...node,
    id: nanoid(),
    children: node.children.map(deepCloneWithNewIds),
  }
}
